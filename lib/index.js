"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vitePlugin = exports.babelPlugin = void 0;
const tslib_1 = require("tslib");
const babel_plugin_1 = tslib_1.__importDefault(require("./babel-plugin"));
exports.babelPlugin = babel_plugin_1.default;
const vite_plugin_1 = tslib_1.__importDefault(require("./vite-plugin"));
exports.vitePlugin = vite_plugin_1.default;
exports.default = babel_plugin_1.default;
