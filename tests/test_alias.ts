import { transform } from "./translate"
import * as path from 'path'
import * as fs from 'fs'

const allFiles = fs.readdirSync(path.resolve(__dirname, "./cases_alias_vue")).map(f => [path.resolve(__dirname, "./cases_alias_vue", f), f])

function allfileLoop(cb: (dir: string, name: string) => any) {
    allFiles.forEach(([f, name]) => {
        cb(f, name)
    })
}

allfileLoop((f, name) => {
    test(`normal for ${name}`, function () {
        expect(transform(f, { vue: "@vue" })!.code).toMatchSnapshot()
    })
})


