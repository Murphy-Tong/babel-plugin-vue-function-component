// @ts-nocheck
import babel from '@babel/core'

export default function (src: string, map: any, meta: any) {
    const callback = this.async()
    babel.transformAsync(src, {
        plugins: ['babel-plugin-vue-function-component'],
        filename: this.resourcePath,
        configFile: false
    }).then(res => {
        callback(null, res.code, res.map, meta)
    }).catch(e => {
        callback(e)
    })
}