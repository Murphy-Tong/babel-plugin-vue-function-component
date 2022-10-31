import { transform } from "./translate"
import * as path from 'path'

test("special case", function () {
    expect(transform(path.resolve(__dirname, 'cases_special', '1.tsx'), {}, true)!.code).toMatchSnapshot()
})


