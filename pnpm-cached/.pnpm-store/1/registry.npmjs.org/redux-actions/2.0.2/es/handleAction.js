var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import isFunction from 'lodash-es/isFunction';
import isPlainObject from 'lodash-es/isPlainObject';
import identity from 'lodash-es/identity';
import isNil from 'lodash-es/isNil';
import isUndefined from 'lodash-es/isUndefined';
import includes from 'lodash-es/includes';
import invariant from 'invariant';
import { ACTION_TYPE_DELIMITER } from './combineActions';

export default function handleAction(type) {
  var reducer = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];
  var defaultState = arguments[2];

  var types = type.toString().split(ACTION_TYPE_DELIMITER);
  invariant(!isUndefined(defaultState), 'defaultState for reducer handling ' + types.join(', ') + ' should be defined');
  invariant(isFunction(reducer) || isPlainObject(reducer), 'Expected reducer to be a function or object with next and throw reducers');

  var _ref = isFunction(reducer) ? [reducer, reducer] : [reducer.next, reducer.throw].map(function (aReducer) {
    return isNil(aReducer) ? identity : aReducer;
  });

  var _ref2 = _slicedToArray(_ref, 2);

  var nextReducer = _ref2[0];
  var throwReducer = _ref2[1];


  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];
    var actionType = action.type;

    if (!actionType || !includes(types, actionType.toString())) {
      return state;
    }

    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}