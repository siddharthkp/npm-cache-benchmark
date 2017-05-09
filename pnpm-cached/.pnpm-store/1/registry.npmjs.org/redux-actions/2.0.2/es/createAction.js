import identity from 'lodash-es/identity';
import isFunction from 'lodash-es/isFunction';
import isUndefined from 'lodash-es/isUndefined';
import isNull from 'lodash-es/isNull';
import invariant from 'invariant';

export default function createAction(type) {
  var payloadCreator = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];
  var metaCreator = arguments[2];

  invariant(isFunction(payloadCreator) || isNull(payloadCreator), 'Expected payloadCreator to be a function, undefined or null');

  var finalPayloadCreator = isNull(payloadCreator) ? identity : payloadCreator;

  var actionCreator = function actionCreator() {
    var hasError = (arguments.length <= 0 ? undefined : arguments[0]) instanceof Error;

    var action = {
      type: type
    };

    var payload = hasError ? arguments.length <= 0 ? undefined : arguments[0] : finalPayloadCreator.apply(undefined, arguments);
    if (!isUndefined(payload)) {
      action.payload = payload;
    }

    if (hasError || payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if (isFunction(metaCreator)) {
      action.meta = metaCreator.apply(undefined, arguments);
    }

    return action;
  };

  actionCreator.toString = function () {
    return type.toString();
  };

  return actionCreator;
}