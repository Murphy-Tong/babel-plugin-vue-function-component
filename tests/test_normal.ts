import { transform } from "./init"
import * as path from 'path'
test('normal', function () {
    const { code } = transform(path.resolve(__dirname, './cases/', 'simple.tsx'))!
    expect(code).toMatchSnapshot()
})