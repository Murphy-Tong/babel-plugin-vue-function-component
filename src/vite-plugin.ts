import * as babel from '@babel/core'
import { AcornNode, Plugin } from 'rollup'
import babelPlugin from './babel-plugin'
import { canProcessFile, ParseOption } from './config'

export default function (opt?: ParseOption): Plugin {
    return {
        name: 'fn-vue',
        async transform(code, id) {
            if (canProcessFile(id, opt?.includeFiles)) {
                const plugins: babel.PluginItem[] = [[babelPlugin, opt]]
                const res = await babel.transformAsync(code, { configFile: false, filename: id, sourceFileName: id, plugins })
                if (!res?.code) {
                    return
                }
                return {
                    code: res!.code,
                    map: res!.map,
                    ast: res!.ast as AcornNode
                }
            }
        },
    }
} 