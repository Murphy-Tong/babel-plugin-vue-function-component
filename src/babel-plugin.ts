//@ts-ignore
import tsxSyntax from '@babel/plugin-syntax-typescript';
import template from "@babel/template";
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import fspath from 'path';
import { canProcessFile, canProcessFn, DEFAULT_CONFIG, ParseOption } from './config';

type IState = {
    /**
     * ast parsing config
     */
    program?: NodePath<t.Program>,
    insertTarget?: t.ImportDeclaration,
    inserted?: boolean,
    vueNSName?: string,
    propLocalName?: string,
    defineComponentLocalName?: string,
    typeDefines?: Array<t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>,
    convertedFunctions?: string[],
    buildCodeFrameError?: (msg: string) => Error,

    /**
     * babel passed attr
     */
    filename: string,
    opts?: ParseOption
}

type TSTypeFieldMap = Record<string, t.TSType>

function allSameOrNull(values: Array<t.TSType>) {
    const [first, ...rest] = values;
    const converted = resolveJSType(first);

    for (const val of rest) {
        if (converted !== resolveJSType(val)) {
            return null;
        }
    }

    return converted;
}

function isPrimaryType(type: string) {
    return type === 'String' || type === 'Number' || type === 'Boolean'
}

function uppercase(str: string) {
    return str.replace(/^./, c => c.toUpperCase());
}

function resolveJSType(node: t.TSType): string | null {
    if (t.isTSStringKeyword(node)) {
        return "String"
    }
    if (t.isTSNumberKeyword(node)) {
        return "Number"
    }
    if (t.isTSBooleanKeyword(node)) {
        return "Boolean"
    }
    if (t.isTSArrayType(node) || t.isTSTupleType(node) || (t.isTSTypeReference(node) && ((node as t.TSTypeReference).typeName as t.Identifier).name === 'Array')) {
        return "Array"
    }
    if (t.isTSTypeReference(node)) {
        if (t.isIdentifier(node.typeName)) {
            return uppercase(node.typeName.name)
        }
        return null
    }
    if (t.isTSLiteralType(node)) {
        // field: "A"|1|false
        if (t.isTemplateLiteral(node.literal) || t.isUnaryExpression(node.literal)) {
            return null
        }
        const value = node.literal.value;
        const type = typeof value;
        return type.replace(/^./, c => c.toUpperCase());
    }
    if (t.isTSAnyKeyword(node) || t.isTSTypeReference(node) || t.isTSTypeLiteral(node)) {
        // field: any;
        // field: MyInterface;
        // field: { prop: string };
        return 'Object';
    }
    if (t.isTSUnionType(node)) {
        // field: 'blue' | 'green' | 'red';
        return allSameOrNull(node.types);
    }
    return null
}

const SETUP_TEMPLATE = template.expression(`
CALLEE({
    name:NAME,
    props:PROPS_NODE,
    setup:SETUP_FN
})
`)

const SETUP_TEMPLATE_NO_PROPS = template.expression(`
CALLEE({
    name:NAME,
    setup:SETUP_FN
})
`)

function resolveTSMembersFromTSObject(node: t.TSTypeLiteral, state: IState) {
    const propsMap: TSTypeFieldMap = {}
    for (let member of node.members) {
        if (t.isTSPropertySignature(member)) {
            const name = (member.key as t.Identifier).name;
            propsMap[name] = (member.typeAnnotation as t.TSTypeAnnotation).typeAnnotation;
        } else {
            throw state.buildCodeFrameError!('无法解析的ts类型:' + member.type)
        }
    }
    return propsMap
}


function resolveTSMembersFromTSInterface(node: t.TSInterfaceBody, state: IState) {
    const propsMap: TSTypeFieldMap = {}
    node.body.forEach(ele => {
        if (!t.isTSPropertySignature(ele)) {
            throw state.buildCodeFrameError!("无法解析的interface 成员:" + ele.type)
        }
        propsMap[(ele.key as t.Identifier).name] = ele.typeAnnotation!.typeAnnotation
    })
    return propsMap
}

function findType(name: string, state: IState) {
    return state.typeDefines?.find(type => type.id.name === name)
}

function resolveTSMembersFromTSReference(node: t.TSTypeReference, state: IState) {
    const typeDeclared = findType((node.typeName as t.Identifier).name, state)
    if (!typeDeclared) {
        throw state.buildCodeFrameError!("当前文件中找不到定义的类型:" + (node.typeName as t.Identifier).name)
    }
    if (t.isTSInterfaceDeclaration(typeDeclared)) {
        return resolveTSMembersFromTSInterface(typeDeclared.body, state)
    }

    if (t.isTSTypeAliasDeclaration(typeDeclared)) {
        return resolveTSMembers(typeDeclared.typeAnnotation, state)
    }
    throw state.buildCodeFrameError!('无法解析ts类型成员:' + node.type)
}

function resolveTSMembers(node: t.TSType, state: IState): TSTypeFieldMap | null {
    if (t.isTSTypeLiteral(node)) {
        return resolveTSMembersFromTSObject(node, state)
    }
    if (t.isTSTypeReference(node)) {
        return resolveTSMembersFromTSReference(node, state)
    }
    if (t.isTSAnyKeyword(node)) {
        return null
    }
    throw state.buildCodeFrameError!('无法解析的ts类型:' + node.type)
}


function setErrorBuilder(state: IState, path: NodePath) {
    state.buildCodeFrameError = path.buildCodeFrameError.bind(path)
}

function createSetupExpression(name: string, fn: t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression, state: IState): t.Expression {
    const propsTypeMap: Record<string, t.TSType> | null = fn.params?.[0] ? resolveTSMembers((fn.params[0].typeAnnotation as t.TSTypeAnnotation)?.typeAnnotation, state) : null
    const propsObj: t.ObjectProperty[] = []
    const propType = state.vueNSName ? `${state.vueNSName}.PropType` : (state.propLocalName || 'PropType')
    if (propsTypeMap) {
        Object.entries(propsTypeMap).forEach(([name, node]) => {
            const tsType = resolveJSType(node)
            if (tsType && isPrimaryType(tsType)) {
                propsObj.push(t.objectProperty(t.identifier(name), t.identifier(tsType)))
            } else {
                propsObj.push(t.objectProperty(t.identifier(name), t.tsAsExpression(t.identifier('Object'), t.tSTypeReference(t.identifier(propType), t.tsTypeParameterInstantiation([node])))))
            }
        })
    }
    const [p0] = fn.params || [];
    const params = [...fn.params || []]
    if (p0) {
        // 去掉类型
        params[0] = t.identifier((p0 as t.Identifier).name)
    }
    const isArrow = t.isArrowFunctionExpression(fn)

    const fnExp = isArrow ? t.arrowFunctionExpression(params, fn.body, fn.async) : t.functionExpression(undefined, params, fn.body, fn.generator, fn.async)
    // fnExp.end = fn.end;
    fnExp.extra = fn.extra;
    fnExp.generator = fn.generator;
    // fnExp.innerComments = fn.innerComments;
    // fnExp.leadingComments = fn.leadingComments;
    // fnExp.loc = fn.loc;
    fnExp.predicate = fn.predicate;
    // fnExp.range = fn.range;
    fnExp.returnType = fn.returnType;
    // fnExp.start = fn.start;
    // fnExp.trailingComments = fn.trailingComments;
    fnExp.typeParameters = fn.typeParameters;

    const defineCallee = state.vueNSName ? `${state.vueNSName}.${state.defineComponentLocalName || 'defineComponent'}` : state.defineComponentLocalName || 'defineComponent'
    const placements: any = {
        NAME: t.stringLiteral(name),
        SETUP_FN: fnExp,
        CALLEE: defineCallee,
    }
    if (propsObj.length) {
        placements.PROPS_NODE = t.objectExpression(propsObj)
    }
    return (!propsObj.length ? SETUP_TEMPLATE_NO_PROPS : SETUP_TEMPLATE)(placements);
}

function createComponentVariableDeclaration(name: string, val: t.Expression) {
    return t.variableDeclaration('const', [t.variableDeclarator(t.identifier(name), val)])
}

function processVariableDeclaration(path: NodePath<t.VariableDeclaration>, state: IState) {
    const declarationsCopy = [...path.node.declarations]
    if (!declarationsCopy.length) {
        return
    }
    path.node.declarations.forEach((declare, index) => {
        const name = (declare.id as t.Identifier).name
        const val = declare.init
        if (!val) {
            return
        }
        if (!t.isFunctionExpression(val) && !t.isArrowFunctionExpression(val)) {
            return
        }
        if (!canProcessFn(val, state.filename, name, state.opts!.includeFns)) {
            return
        }
        declarationsCopy.splice(index, 1)
        onFnTransformed(state, path, name)
        path.insertAfter(createComponentVariableDeclaration(name, createSetupExpression(name, val, state)))
    })
    if (!declarationsCopy.length) {
        path.remove()
        return
    }
    path.node.declarations = declarationsCopy
}

function collectTypeDeclaration(node: t.Node): t.TSInterfaceDeclaration | t.TSTypeAliasDeclaration | null {
    if (t.isTSTypeAliasDeclaration(node)) {
        return node
    } else if (t.isTSInterfaceDeclaration(node)) {
        return node
    } else if (t.isExportNamedDeclaration(node) && node.declaration) {
        return collectTypeDeclaration(node.declaration!)
    }
    return null
}

function addVueImport(path: NodePath<t.Program>, state: IState) {
    if (state.inserted) {
        return
    }
    state.inserted = true
    if (state.vueNSName) {
        return
    }
    let insertTarget = state.insertTarget
    //没有导入Vue
    if (!insertTarget) {
        insertTarget = t.importDeclaration([t.importSpecifier(t.identifier("defineComponent"), t.identifier("defineComponent")), t.importSpecifier(t.identifier("PropType"), t.identifier("PropType"))], t.stringLiteral(state.opts!.vue!))
        path.node.body.unshift(insertTarget)
        state.propLocalName = "PropType"
        state.defineComponentLocalName = "defineComponent"
        return
    }

    if (!state.propLocalName) {
        insertTarget.specifiers.push(t.importSpecifier(t.identifier('PropType'), t.identifier('PropType')))
    }
    if (!state.defineComponentLocalName) {
        insertTarget.specifiers.push(t.importSpecifier(t.identifier('defineComponent'), t.identifier('defineComponent')))
    }
}

function onFnTransformed(state: IState, path: NodePath<t.Node>, fnName: string) {
    addVueImport(state.program!, state)
    state.convertedFunctions?.push(fnName)
}

export default function () {
    return {
        inherits: tsxSyntax,
        visitor: {
            Program: {
                enter(path: NodePath<t.Program>, state: IState) {
                    if (!canProcessFile(state.filename, state.opts!.includeFiles)) {
                        path.stop()
                        return
                    }
                    setErrorBuilder(state, path)
                    const mergedOptions = { ...DEFAULT_CONFIG, ...(state.opts || {}) }
                    state.opts = mergedOptions
                    state.vueNSName = undefined
                    state.defineComponentLocalName = undefined
                    state.propLocalName = undefined
                    state.convertedFunctions = []
                    state.program = path

                    const others = path.node.body.filter(segment => !t.isImportDeclaration(segment))
                    if (!others.length) {
                        // 没有需要处理的东西
                        path.stop()
                        return
                    }

                    state.typeDefines = [] as Array<t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>
                    others.forEach(seg => {
                        const declaration = collectTypeDeclaration(seg)
                        if (declaration) {
                            state.typeDefines!.push(declaration)
                        }
                    })

                    const imports = path.node.body.filter(segment => t.isImportDeclaration(segment))
                    for (let i = 0; i < imports.length; i++) {
                        const segment = path.node.body[i]
                        if (!t.isImportDeclaration(segment)) {
                            continue;
                        }
                        if (segment.source.value !== state.opts!.vue) {
                            continue
                        }
                        const specifiers = segment.specifiers
                        if (!specifiers.length) {
                            continue
                        }
                        for (let j = 0; j < specifiers.length; j++) {
                            const specifier = specifiers[j]
                            if (t.isImportNamespaceSpecifier(specifier)) {
                                //import * as XX
                                state.vueNSName = specifier.local.name;
                                return
                            }
                            if (t.isImportDefaultSpecifier(specifier)) {
                                state.insertTarget = segment
                                continue
                            }
                            if (t.isImportSpecifier(specifier)) {
                                state.insertTarget = segment
                                if ((specifier.imported as t.Identifier).name === 'PropType') {
                                    state.propLocalName = specifier.local.name;
                                } else if ((specifier.imported as t.Identifier).name === 'defineComponent') {
                                    state.defineComponentLocalName = specifier.local.name;
                                }
                            }

                        }
                    }
                }, exit(path: NodePath<t.Program>, state: IState) {
                    state.vueNSName = undefined
                    state.defineComponentLocalName = undefined
                    state.propLocalName = undefined
                    state.typeDefines = undefined
                    state.buildCodeFrameError = undefined
                    state.convertedFunctions = undefined
                    state.insertTarget = undefined
                    state.inserted = undefined
                    state.program = undefined
                }
            },
            FunctionDeclaration: function (path: NodePath<t.FunctionDeclaration>, state: IState) {
                setErrorBuilder(state, path)
                if (!canProcessFn(path.node, state.filename, path.node.id!.name, state.opts!.includeFns)) {
                    path.skip()
                    return
                }
                // 顶级的方法声明肯定有名字
                onFnTransformed(state, path, path.node.id!.name)
                path.replaceWith(createComponentVariableDeclaration(path.node.id!.name, createSetupExpression(path.node.id!.name, path.node, state)))
                path.skip()
            },
            VariableDeclaration: function (path: NodePath<t.VariableDeclaration>, state: IState) {
                setErrorBuilder(state, path)
                processVariableDeclaration(path, state)
                path.skip()
            },
            ExportDefaultDeclaration: function (path: NodePath<t.ExportDefaultDeclaration>, state: IState) {
                setErrorBuilder(state, path)
                if (!path.node.exportKind) {
                    path.skip()
                    return
                }
                const declaration = path.node.declaration
                if (t.isFunctionDeclaration(declaration)) {
                    if (!canProcessFn(declaration, state.filename, declaration.id?.name || 'default', state.opts!.includeFns)) {
                        path.skip()
                        return
                    }
                    onFnTransformed(state, path, declaration.id?.name || fspath.parse(state.filename).name)
                    path.get('declaration').replaceWith(createSetupExpression(declaration.id?.name || fspath.parse(state.filename).name, declaration, state))
                }
                path.skip()
            },
            ExportNamedDeclaration: function (path: NodePath<t.ExportNamedDeclaration>, state: IState) {
                setErrorBuilder(state, path)
                if (path.node.exportKind !== 'value') {
                    path.skip()
                    return
                }
                const declaration = path.node.declaration
                if (t.isFunctionDeclaration(declaration)) {
                    if (!canProcessFn(declaration, state.filename, declaration.id!.name, state.opts!.includeFns)) {
                        path.skip()
                        return
                    }
                    //方法声明肯定有名字的
                    onFnTransformed(state, path, declaration.id!.name)
                    path.replaceWith(createSetupExpression(declaration.id!.name, declaration, state))
                } else if (t.isVariableDeclaration(declaration)) {
                    // 常量赋值 ，取常量的名字
                    processVariableDeclaration(path.get('declaration') as NodePath<t.VariableDeclaration>, state)
                }
                path.skip()
            },
        }
    }
}
