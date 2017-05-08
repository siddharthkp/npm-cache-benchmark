'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEpic;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addOutputWarning(source, name) {
  var actionsOutputWarned = false;
  return source.do(function (action) {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(actionsOutputWarned || action && typeof action.type === 'string', '\n        Future versions of redux-epic will pass all items to the dispatch\n        function.\n        Make sure you intented to pass ' + action + ' to the dispatch or you\n        filter out non-action elements at the individual epic level.\n        Check the ' + name + ' epic.\n      ') : void 0;
    actionsOutputWarned = !(action && typeof action.type === 'string');
  });
}

function createMockStore(store, name) {
  var mockStoreWarned = false;
  function mockStore() {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(mockStoreWarned, '\n        The second argument to an epic is now a mock store,\n        but it was called as a function. Pull the getState method off\n        of the second argument of the epic instead.\n        Check the ' + name + ' epic.\n\n        Epic type signature:\n        epic(\n          actions: Observable[...Action],\n          { dispatch: Function, getState: Function }\n        ) => Observable[...Action]\n      ') : void 0;
    mockStoreWarned = true;
    return store.getState();
  }
  mockStore.getState = store.getState;
  mockStore.dispatch = store.dispatch;
  return mockStore;
}
// Epic(
//   actions: Observable[...Action],
//   getState: () => Object,
//   dependencies: Object
// ) => Observable[...Action]
//
// interface EpicMiddleware {
//   ({
//     dispatch: Function,
//     getState: Function
//   }) => next: Function => action: Action => Action,
//   // used to dispose sagas
//   dispose() => Void,
//
//   // the following are internal methods
//   // they may change without warning
//   restart() => Void,
//   end() => Void,
//   subscribe() => Disposable,
//   subscribeOnCompleted() => Disposable,
//
// }
//
// createEpic(
//   dependencies: Object|Epic,
//   ...epics: [...Epics]
// ) => EpicMiddleware

function createEpic(dependencies) {
  for (var _len = arguments.length, epics = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    epics[_key - 1] = arguments[_key];
  }

  if (typeof dependencies === 'function') {
    epics.push(dependencies);
    dependencies = {};
  }
  var actions = void 0;
  var lifecycle = void 0;
  var compositeDisposable = void 0;
  var start = void 0;
  function epicMiddleware(store) {
    var dispatch = store.dispatch;


    start = function start() {
      compositeDisposable = new _rx.CompositeDisposable();
      actions = new _rx.Subject();
      lifecycle = new _rx.Subject();
      var epicSubscription = _rx.Observable.from(epics)
      // need to test for pass-through sagas
      .map(function (epic) {
        var name = epic.name || 'Anon Epic';
        var result = epic(actions, createMockStore(store, name), dependencies);
        !_rx.Observable.isObservable(result) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '\n              Epics should returned an observable but got %s\n              Check the ' + name + ' epic\n            ', result) : (0, _invariant2.default)(false) : void 0;
        !(result !== actions) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '\n              Epics should not be identity functions.\n              Check the ' + name + ' epic\n            ') : (0, _invariant2.default)(false) : void 0;
        return addOutputWarning(result, name);
      }).mergeAll().filter(function (action) {
        return action && typeof action.type === 'string';
      }).subscribe(function (action) {
        return dispatch(action);
      }, function (err) {
        throw err;
      }, function () {
        return lifecycle.onCompleted();
      });
      compositeDisposable.add(epicSubscription);
    };
    start();
    return function (next) {
      return function (action) {
        var result = next(action);
        actions.onNext(action);
        return result;
      };
    };
  }

  epicMiddleware.subscribe = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return lifecycle.subscribe.apply(lifecycle, args);
  };
  epicMiddleware.subscribeOnCompleted = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return lifecycle.subscribeOnCompleted.apply(lifecycle, args);
  };
  epicMiddleware.end = function () {
    return actions.onCompleted();
  };
  epicMiddleware.dispose = function () {
    return compositeDisposable.dispose();
  };
  epicMiddleware.restart = function () {
    epicMiddleware.dispose();
    actions.dispose();
    start();
  };
  return epicMiddleware;
}