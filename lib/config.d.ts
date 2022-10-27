import * as t from '@babel/types';
export declare const DEFAULT_CONFIG: {
    includeFns: string[];
    vue: string;
};
declare type IncludeFileCB = ((filename: string) => boolean) | string[];
declare type IncludeFnCB = ((filename: string, fnName?: string) => boolean) | string[];
export interface ParseOption {
    /**
     * must endwith tsx?
     */
    includeFiles?: IncludeFileCB;
    /**
     * @see micromatch and default is fn with UpperCase first char name
     */
    includeFns?: IncludeFnCB;
    /**
     * vue module name
     */
    vue?: string;
}
export declare function canProcessFile(filename: string, includeFiles?: IncludeFileCB): boolean;
export declare function canProcessFn(fn: t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression, filename: string, name?: string, includeFns?: IncludeFnCB): boolean;
export {};
