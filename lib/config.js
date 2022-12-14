"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canProcessFn = exports.canProcessFile = exports.DEFAULT_CONFIG = void 0;
const tslib_1 = require("tslib");
const micromatch_1 = tslib_1.__importDefault(require("micromatch"));
exports.DEFAULT_CONFIG = {
    includeFns: ['[_A-Z]*', 'default'],
    vue: 'vue'
};
function isTSX(fileName) {
    return /\.tsx$/.test(fileName);
}
function isJS(fileName) {
    return /\.jsx?$/.test(fileName);
}
function canProcessFile(filename, includeFiles) {
    // no js forever
    if (isJS(filename)) {
        return false;
    }
    if (!includeFiles) {
        // only tsx
        return isTSX(filename);
    }
    if (typeof includeFiles === 'function') {
        return includeFiles(filename);
    }
    return micromatch_1.default.isMatch(filename, includeFiles);
}
exports.canProcessFile = canProcessFile;
function canProcessFn(fn, filename, name, includeFns) {
    if (!includeFns) {
        return true;
    }
    // @ts-ignore
    const fnName = name || fn.id.name;
    if (typeof includeFns === 'function') {
        return includeFns(filename, fnName);
    }
    if (!fnName) {
        return false;
    }
    return micromatch_1.default.isMatch(fnName, includeFns);
}
exports.canProcessFn = canProcessFn;
