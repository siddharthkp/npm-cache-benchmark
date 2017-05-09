function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import isPlainObject from 'lodash-es/isPlainObject';
import reduceReducers from 'reduce-reducers';
import invariant from 'invariant';
import handleAction from './handleAction';
import ownKeys from './ownKeys';

export default function handleActions(handlers, defaultState) {
  invariant(isPlainObject(handlers), 'Expected handlers to be an plain object.');
  var reducers = ownKeys(handlers).map(function (type) {
    return handleAction(type, handlers[type], defaultState);
  });
  var reducer = reduceReducers.apply(undefined, _toConsumableArray(reducers));
  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];
    return reducer(state, action);
  };
}