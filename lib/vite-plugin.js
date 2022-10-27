"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const babel = tslib_1.__importStar(require("@babel/core"));
const babel_plugin_1 = tslib_1.__importDefault(require("./babel-plugin"));
const config_1 = require("./config");
// @ts-ignore
const plugin_syntax_typescript_1 = tslib_1.__importDefault(require("@babel/plugin-syntax-typescript"));
function default_1(opt) {
    return {
        name: 'fn-vue',
        // @ts-ignore
        async transform(code, id) {
            if ((0, config_1.canProcessFile)(id, opt?.includeFiles)) {
                const plugins = [[babel_plugin_1.default, opt], [plugin_syntax_typescript_1.default, { isTSX: true }]];
                const res = await babel.transformAsync(code, { configFile: false, filename: id, sourceFileName: id, plugins });
                if (!res?.code) {
                    return;
                }
                return {
                    code: res.code,
                    map: res.map,
                    ast: res.ast
                };
            }
        },
    };
}
exports.default = default_1;
