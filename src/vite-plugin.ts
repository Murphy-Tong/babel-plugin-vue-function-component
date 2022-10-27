import * as babel from '@babel/core'
import { Plugin } from 'rollup'
import babelPlugin from './babel-plugin'
import { canProcessFile, ParseOption } from './config'
// @ts-ignore
import SyntaxPlugin from '@babel/plugin-syntax-typescript'

export default function (opt?: ParseOption): Plugin {
    return {
        name: 'fn-vue',
        // @ts-ignore
        async transform(code, id) {
            if (canProcessFile(id, opt?.includeFiles)) {
                const plugins: babel.PluginItem[] = [[babelPlugin, opt], [SyntaxPlugin, { isTSX: true }]]
                const res = await babel.transformAsync(code, { configFile: false, filename: id, sourceFileName: id, plugins })
                if (!res?.code) {
                    return
                }
                return {
                    code: res!.code,
                    map: res!.map,
                    ast: res!.ast
                }
            }
        },
    }
} 