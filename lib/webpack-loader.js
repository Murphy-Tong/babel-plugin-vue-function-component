"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// @ts-nocheck
const babel = tslib_1.__importStar(require("@babel/core"));
function default_1(src, map, meta) {
    const callback = this.async();
    babel.transformAsync(src, {
        plugins: ['babel-plugin-vue-function-component'],
        filename: this.resourcePath,
        configFile: false
    }).then(res => {
        callback(null, res.code, res.map, meta);
    }).catch(e => {
        callback(e);
    });
}
exports.default = default_1;
