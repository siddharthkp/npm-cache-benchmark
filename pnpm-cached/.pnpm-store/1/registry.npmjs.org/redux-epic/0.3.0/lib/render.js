'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// render(
//   Component: ReactComponent,
//   DomContainer: DOMNode
// ) => Observable[RootInstance]

function render(Component, DOMContainer) {
  return _rx.Observable.create(function (observer) {
    try {
      _reactDom2.default.render(Component, DOMContainer, function () {
        observer.onNext(this);
      });
    } catch (e) {
      return observer.onError(e);
    }

    return _rx.Disposable.create(function () {
      return _reactDom2.default.unmountComponentAtNode(DOMContainer);
    });
  });
}