import { PluginObj } from "@babel/core";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ParseOption } from "./config";
declare type IState = {
    /**
     * ast parsing config
     */
    program?: NodePath<t.Program>;
    insertTarget?: t.ImportDeclaration;
    inserted?: boolean;
    vueNSName?: string;
    propLocalName?: string;
    defineComponentLocalName?: string;
    typeDefines?: Array<t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>;
    convertedFunctions?: string[];
    buildCodeFrameError?: (msg: string) => Error;
    /**
     * babel passed attr
     */
    filename: string;
    opts?: ParseOption;
};
export default function (): PluginObj<IState>;
export {};
