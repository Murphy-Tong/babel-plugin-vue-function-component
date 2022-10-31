
import micromatch from 'micromatch';
import * as t from '@babel/types';

export const DEFAULT_CONFIG = {
    includeFns: ['[_A-Z]*', 'default'],
    vue: 'vue'
}

type IncludeFileCB = ((filename: string) => boolean) | string[]
type IncludeFnCB = ((filename: string, fnName?: string) => boolean) | string[]

export interface ParseOption {
    /**
     * must endwith tsx?
     */
    includeFiles?: IncludeFileCB,
    /**
     * @see micromatch and default is fn with UpperCase first char name
     */
    includeFns?: IncludeFnCB,
    /**
     * vue module name
     */
    vue?: string
}


function isTSX(fileName: string) {
    return /\.tsx$/.test(fileName)
}

function isJS(fileName: string) {
    return /\.jsx?$/.test(fileName)
}

export function canProcessFile(filename: string, includeFiles?: IncludeFileCB) {
    // no js forever
    if (isJS(filename)) {
        return false
    }
    if (!includeFiles) {
        // only tsx
        return isTSX(filename)
    }
    if (typeof includeFiles === 'function') {
        return includeFiles(filename)
    }
    return micromatch.isMatch(filename, includeFiles)
}


export function canProcessFn(fn: t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression, filename: string, name?: string, includeFns?: IncludeFnCB) {
    if (!includeFns) {
        return true
    }
    // @ts-ignore
    const fnName = name || fn.id!.name
    if (typeof includeFns === 'function') {
        return includeFns(filename, fnName)
    }
    if (!fnName) {
        return false
    }
    return micromatch.isMatch(fnName, includeFns)
}