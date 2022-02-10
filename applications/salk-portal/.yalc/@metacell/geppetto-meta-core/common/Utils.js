"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;

function extend(destObj, sourceObj) {
  for (var v in sourceObj) {
    if (destObj[v] !== undefined) {
      console.warn('extending', destObj, 'with', sourceObj, 'is overriding field ' + v);
    }

    destObj[v] = sourceObj[v];
  }
}
//# sourceMappingURL=Utils.js.map