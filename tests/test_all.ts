import { transform } from "./translate"
import * as path from 'path'
import * as fs from 'fs'

const allFiles = fs.readdirSync(path.resolve(__dirname, "./cases")).map(f => [path.resolve(__dirname, "./cases", f), f])

function allfileLoop(cb: (dir: string, name: string) => any) {
    allFiles.forEach(([f, name]) => {
        cb(f, name)
    })
}

allfileLoop((f, name) => {
    test(`normal for ${name}`, function () {
        expect(transform(f)!.code).toMatchSnapshot()
    })
})


allfileLoop((f, name) => {
    test(`plugin config file dir empty arr for ${name}`, function () {
        expect(transform(f, { includeFiles: [] })!.code).toMatchSnapshot()
    })
})

allfileLoop((f, name) => {
    test(`plugin config file dir only tsx for ${name}`, function () {
        expect(transform(f, { includeFiles: ["**/*.tsx"] })!.code).toMatchSnapshot()
    })
})

allfileLoop((f, name) => {
    test(`plugin config file dir only ts for ${name}`, function () {
        expect(transform(f, { includeFiles: ["**/*.ts"] })!.code).toMatchSnapshot()
    })
})

allfileLoop((f, name) => {
    test(`plugin config file dir only js for ${name}`, function () {
        expect(transform(f, { includeFiles: ["**/*.js"] })!.code).toMatchSnapshot()
    })
})


allfileLoop((f, name) => {
    test(`plugin config file dir fn endwith .ts for ${name}`, function () {
        expect(transform(f, {
            includeFiles: function (dir) {
                return dir.endsWith('.ts')
            }
        })!.code).toMatchSnapshot()
    })
})

allfileLoop((f, name) => {
    test(`plugin config fn name is ComponentLocalProps or componentValNamed or default for ${name}`, function () {
        expect(transform(f, {
            includeFns: ['ComponentLocalProps', 'componentValNamed', 'default']
        })!.code).toMatchSnapshot()
    })
})


allfileLoop((f, name) => {
    test(`plugin config fn name is ComponentLocalProps or componentValNamed in file endwith tsx for ${name}`, function () {
        expect(transform(f, {
            includeFns: ['ComponentLocalProps', 'componentValNamed'],
            includeFiles: ['**/*.tsx']
        })!.code).toMatchSnapshot()
    })
})


allfileLoop((f, name) => {
    test(`plugin config fn name is ComponentLocalProps or componentValNamed in file endwith js for ${name}`, function () {
        expect(transform(f, {
            includeFns: ['ComponentLocalProps', 'componentValNamed'],
            includeFiles: ['**/*.js']
        })!.code).toMatchSnapshot()
    })
})


