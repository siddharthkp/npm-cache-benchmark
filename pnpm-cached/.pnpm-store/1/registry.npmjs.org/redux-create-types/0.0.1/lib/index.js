'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.createTypes = createTypes;
exports.createAsyncTypes = createAsyncTypes;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = exports.config = {
  delimiter: '.',
  next: 'next',
  start: 'start',
  error: 'error',
  complete: 'complete'
};

function createTypes(types, ns) {
  var delimiter = arguments.length <= 2 || arguments[2] === undefined ? config.delimiter : arguments[2];

  !Array.isArray(types) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'createTypes expected a Array of strings for types, but got %s', types) : (0, _invariant2.default)(false) : void 0;
  !(ns && typeof ns === 'string') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'createTypes expected a string for ns, but got %s', delimiter) : (0, _invariant2.default)(false) : void 0;
  !(typeof delimiter === 'string') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'createAsyncTypes expected a string for delimiter, but got %s', delimiter) : (0, _invariant2.default)(false) : void 0;
  return types.reduce(function (types, type) {
    if (typeof type === 'string') {
      types[type] = ns + delimiter + type;
    } else if (type && type[config.start] && typeof type.toString === 'function') {
      types[type.toString()] = Object.keys(type).reduce(function (typeObj, key) {
        var value = type[key];
        if (key === 'toString') {
          typeObj.toString = function () {
            return ns + delimiter + value();
          };
        } else if (value && typeof value === 'string') {
          typeObj[key] = ns + delimiter + value;
        }
        return typeObj;
      }, {});
    }
    return types;
  }, {});
}

function createAsyncTypes(type) {
  var _ref;

  var delimiter = arguments.length <= 1 || arguments[1] === undefined ? config.delimiter : arguments[1];

  !(type && typeof type === 'string') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'createAsyncTypes expected a string for type, but got %s', type) : (0, _invariant2.default)(false) : void 0;
  !(typeof delimiter === 'string') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'createAsyncTypes expected a string for delimiter, but got %s', delimiter) : (0, _invariant2.default)(false) : void 0;
  var start = config.start;
  var next = config.next;
  var complete = config.complete;
  var error = config.error;

  return _ref = {}, (0, _defineProperty3.default)(_ref, start, type + delimiter + config.start), (0, _defineProperty3.default)(_ref, next, type + delimiter + config.next), (0, _defineProperty3.default)(_ref, error, type + delimiter + config.error), (0, _defineProperty3.default)(_ref, complete, type + delimiter + config.complete), (0, _defineProperty3.default)(_ref, 'toString', function toString() {
    return type;
  }), _ref;
}