import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ParseOption } from './config';
declare type IState = {
    /**
     * ast parsing config
     */
    program?: NodePath<t.Program>;
    insertTarget?: t.ImportDeclaration;
    inserted?: boolean;
    vueNSName?: string;
    vue?: string;
    propLocalName?: string;
    defineComponentLocalName?: string;
    typeDefines?: Array<t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>;
    convertedFunctions?: string[];
    buildCodeFrameError?: (msg: string) => Error;
    /**
     * babel passed attr
     */
    filename: string;
} & ParseOption;
export default function (): {
    inherits: any;
    visitor: {
        Program: {
            enter(path: NodePath<t.Program>, state: IState): void;
            exit(path: NodePath<t.Program>, state: IState): void;
        };
        FunctionDeclaration: (path: NodePath<t.FunctionDeclaration>, state: IState) => void;
        VariableDeclaration: (path: NodePath<t.VariableDeclaration>, state: IState) => void;
        ExportDefaultDeclaration: (path: NodePath<t.ExportDefaultDeclaration>, state: IState) => void;
        ExportNamedDeclaration: (path: NodePath<t.ExportNamedDeclaration>, state: IState) => void;
    };
};
export {};
