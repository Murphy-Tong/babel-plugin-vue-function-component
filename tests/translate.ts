import { transformSync } from '@babel/core'
import * as fs from 'fs'
import * as path from 'path'
import { ParseOption } from '../src/config'

function generate(name: string, code: string) {
    const dir = path.resolve(__dirname, "translated")
    fs.mkdirSync(dir, { recursive: true })
    fs.createWriteStream(path.resolve(dir, name)).write(code)
}


export function transform(fileDir: fs.PathLike, opt?: ParseOption) {
    const res = transformSync(fs.readFileSync(fileDir, { encoding: 'utf-8' }), {
        filename: fileDir.toString(),
        sourceFileName: fileDir.toString(),
        configFile: false,
        plugins: [['./lib/babel-plugin.js', opt], ['@babel/plugin-syntax-typescript', { isTSX: true }]],
    })
    generate(path.parse(fileDir.toString()).base, res?.code || "")
    return res
}

