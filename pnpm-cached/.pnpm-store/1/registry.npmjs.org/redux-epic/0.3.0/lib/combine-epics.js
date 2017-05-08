'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combineEpics;

var _rx = require('rx');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // source
// github.com/redux-observable/redux-observable/blob/master/src/combineEpics.js


function combineEpics() {
  for (var _len = arguments.length, epics = Array(_len), _key = 0; _key < _len; _key++) {
    epics[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _rx.Observable.merge.apply(_rx.Observable, _toConsumableArray(epics.map(function (epic) {
      var output = epic.apply(undefined, args);
      if (!output) {
        throw new TypeError('\n        combineEpics: one of the provided Epics\n        "' + (epic.name || '<anonymous>') + '" does not return a stream.\n        Double check you\'re not missing a return statement!\n      ');
      }
      return output;
    })));
  };
}