'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderToString;

var _rx = require('rx');

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('redux-epic:renderToString');

// renderToString(
//   Component: ReactComponent,
//   epicMiddleware: EpicMiddleware
// ) => Observable[String]

function renderToString(Component, epicMiddleware) {
  try {
    log('initial render pass started');
    _server2.default.renderToStaticMarkup(Component);
    log('initial render pass completed');
  } catch (e) {
    return _rx.Observable.throw(e);
  }
  log('calling action$ onCompleted');
  epicMiddleware.end();
  return _rx.Observable.merge(epicMiddleware).last({ defaultValue: null }).map(function () {
    epicMiddleware.restart();
    var markup = _server2.default.renderToString(Component);
    return { markup: markup };
  });
}