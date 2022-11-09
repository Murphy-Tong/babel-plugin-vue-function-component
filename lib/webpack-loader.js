"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// @ts-nocheck
const core_1 = tslib_1.__importDefault(require("@babel/core"));
function default_1(src, map, meta) {
    const callback = this.async();
    core_1.default.transformAsync(src, {
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
