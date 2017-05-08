"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ofType;
function ofType() {
  for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
    keys[_key] = arguments[_key];
  }

  return this.filter(function (_ref) {
    var type = _ref.type;

    var len = keys.length;
    if (len === 1) {
      return type === keys[0];
    } else {
      for (var i = 0; i < len; i++) {
        if (keys[i] === type) {
          return true;
        }
      }
    }
    return false;
  });
}