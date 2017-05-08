'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultNamespace = exports.unflattenActionCreators = exports.flattenActionMap = undefined;

var _camelCase = require('./camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultNamespace = '/';

function flattenActionMap(actionMap) {
  var namespace = arguments.length <= 1 || arguments[1] === undefined ? defaultNamespace : arguments[1];
  var partialFlatActionMap = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var partialFlatActionType = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

  function connectNamespace(type) {
    return partialFlatActionType ? '' + partialFlatActionType + namespace + type : type;
  }

  Object.getOwnPropertyNames(actionMap).forEach(function (type) {
    var nextNamespace = connectNamespace(type);
    var actionMapValue = actionMap[type];

    if (!(0, _isPlainObject2.default)(actionMapValue)) {
      partialFlatActionMap[nextNamespace] = actionMap[type];
    } else {
      flattenActionMap(actionMap[type], namespace, partialFlatActionMap, nextNamespace);
    }
  });
  return partialFlatActionMap;
}

function unflattenActionCreators(flatActionCreators) {
  var namespace = arguments.length <= 1 || arguments[1] === undefined ? defaultNamespace : arguments[1];

  function unflatten(flatActionType) {
    var partialNestedActionCreators = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var partialFlatActionTypePath = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    var nextNamespace = (0, _camelCase2.default)(partialFlatActionTypePath.shift());
    if (partialFlatActionTypePath.length) {
      if (!partialNestedActionCreators[nextNamespace]) {
        partialNestedActionCreators[nextNamespace] = {};
      }
      unflatten(flatActionType, partialNestedActionCreators[nextNamespace], partialFlatActionTypePath);
    } else {
      partialNestedActionCreators[nextNamespace] = flatActionCreators[flatActionType];
    }
  }

  var nestedActionCreators = {};
  Object.getOwnPropertyNames(flatActionCreators).forEach(function (type) {
    return unflatten(type, nestedActionCreators, type.split(namespace));
  });
  return nestedActionCreators;
}

exports.flattenActionMap = flattenActionMap;
exports.unflattenActionCreators = unflattenActionCreators;
exports.defaultNamespace = defaultNamespace;