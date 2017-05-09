'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reduxImmutablejs = require('redux-immutablejs');

var _testUtils = require('react-dom/test-utils');

var _testUtils2 = _interopRequireDefault(_testUtils);

var _reduxForm = require('../reduxForm');

var _reduxForm2 = _interopRequireDefault(_reduxForm);

var _reducer = require('../reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _Field = require('../Field');

var _Field2 = _interopRequireDefault(_Field);

var _Form = require('../Form');

var _Form2 = _interopRequireDefault(_Form);

var _plain = require('../structure/plain');

var _plain2 = _interopRequireDefault(_plain);

var _expectations = require('../structure/plain/expectations');

var _expectations2 = _interopRequireDefault(_expectations);

var _immutable = require('../structure/immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _expectations3 = require('../structure/immutable/expectations');

var _expectations4 = _interopRequireDefault(_expectations3);

var _addExpectations = require('./addExpectations');

var _addExpectations2 = _interopRequireDefault(_addExpectations);

var _SubmissionError = require('../SubmissionError');

var _SubmissionError2 = _interopRequireDefault(_SubmissionError);

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-multi-comp:0 */


var propsAtNthRender = function propsAtNthRender(componentSpy, callNumber) {
  return componentSpy.calls[callNumber].arguments[0];
};

var describeForm = function describeForm(name, structure, combineReducers, expect) {
  var reduxForm = (0, _reduxForm2.default)(structure);
  var Field = (0, _Field2.default)(structure);
  var reducer = (0, _reducer2.default)(structure);
  var fromJS = structure.fromJS,
      getIn = structure.getIn;

  var makeStore = function makeStore() {
    var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var logger = arguments[1];

    var reducers = { form: reducer };
    if (logger) {
      reducers.logger = logger;
    }
    return (0, _redux.createStore)(combineReducers(reducers), fromJS({ form: initial }));
  };

  describe(name, function () {
    it('should throw an error if not in ReduxForm', function () {
      expect(function () {
        _testUtils2.default.renderIntoDocument(_react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_Form2.default, { onSubmit: function onSubmit() {} })
        ));
      }).toThrow(/must be inside a component decorated with reduxForm/);
    });

    it('should output a <form> element with all props mapped', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      });
      var onSubmit = (0, _expect.createSpy)();

      var TestForm = function (_Component) {
        _inherits(TestForm, _Component);

        function TestForm() {
          _classCallCheck(this, TestForm);

          return _possibleConstructorReturn(this, (TestForm.__proto__ || Object.getPrototypeOf(TestForm)).apply(this, arguments));
        }

        _createClass(TestForm, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              _Form2.default,
              { onSubmit: onSubmit, action: '/save', method: 'post', target: '_blank' },
              _react2.default.createElement(Field, { name: 'foo', component: 'input' })
            );
          }
        }]);

        return TestForm;
      }(_react.Component);

      var DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm);
      var dom = _testUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(DecoratedTestForm, null)
      ));

      expect(onSubmit).toNotHaveBeenCalled();

      var tag = _testUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

      // 🤢 This line is DISGUSTING!! Is there a better way to get the props on the <form> ??
      var props = tag[Object.keys(tag)[0]]._currentElement.props;

      expect(props.onSubmit).toBe(onSubmit);
      expect(props.action).toBe('/save');
      expect(props.method).toBe('post');
      expect(props.target).toBe('_blank');
    });

    it('should call the onSubmit given to <Form> when instance API submit() is called', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      });
      var onSubmit = (0, _expect.createSpy)().andReturn(7);

      var TestForm = function (_Component2) {
        _inherits(TestForm, _Component2);

        function TestForm() {
          _classCallCheck(this, TestForm);

          return _possibleConstructorReturn(this, (TestForm.__proto__ || Object.getPrototypeOf(TestForm)).apply(this, arguments));
        }

        _createClass(TestForm, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              _Form2.default,
              { onSubmit: this.props.handleSubmit(onSubmit) },
              _react2.default.createElement(Field, { name: 'foo', component: 'input' })
            );
          }
        }]);

        return TestForm;
      }(_react.Component);

      var DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm);
      var dom = _testUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(DecoratedTestForm, null)
      ));

      var decoratedForm = _testUtils2.default.findRenderedComponentWithType(dom, DecoratedTestForm);

      expect(onSubmit).toNotHaveBeenCalled();

      var result = decoratedForm.submit();
      expect(result).toBe(7);

      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.calls.length).toBe(1);
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 42 });
      expect(onSubmit.calls[0].arguments[1]).toBeA('function');
      expect(onSubmit.calls[0].arguments[2].values).toEqualMap({ foo: 42 });
    });

    it('should call the onSubmit given to <Form> when SUBMIT action is dispatched', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      });
      var onSubmit = (0, _expect.createSpy)();

      var TestForm = function (_Component3) {
        _inherits(TestForm, _Component3);

        function TestForm() {
          _classCallCheck(this, TestForm);

          return _possibleConstructorReturn(this, (TestForm.__proto__ || Object.getPrototypeOf(TestForm)).apply(this, arguments));
        }

        _createClass(TestForm, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              _Form2.default,
              { onSubmit: this.props.handleSubmit(onSubmit) },
              _react2.default.createElement(Field, { name: 'foo', component: 'input' })
            );
          }
        }]);

        return TestForm;
      }(_react.Component);

      var DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm);
      _testUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(DecoratedTestForm, null)
      ));

      expect(onSubmit).toNotHaveBeenCalled();

      store.dispatch((0, _actions.submit)('testForm'));

      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.calls.length).toBe(1);
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 42 });
      expect(onSubmit.calls[0].arguments[1]).toBeA('function');
      expect(onSubmit.calls[0].arguments[2].values).toEqualMap({ foo: 42 });
    });

    it('should properly handle submission errors', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      });
      var onSubmit = (0, _expect.createSpy)().andThrow(new _SubmissionError2.default({ _error: 'Invalid' }));
      var formRender = (0, _expect.createSpy)();

      var TestForm = function (_Component4) {
        _inherits(TestForm, _Component4);

        function TestForm() {
          _classCallCheck(this, TestForm);

          return _possibleConstructorReturn(this, (TestForm.__proto__ || Object.getPrototypeOf(TestForm)).apply(this, arguments));
        }

        _createClass(TestForm, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              _Form2.default,
              { onSubmit: this.props.handleSubmit(onSubmit) },
              _react2.default.createElement(Field, { name: 'foo', component: 'input' })
            );
          }
        }]);

        return TestForm;
      }(_react.Component);

      var DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm);
      var dom = _testUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(DecoratedTestForm, null)
      ));

      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      var decoratedForm = _testUtils2.default.findRenderedComponentWithType(dom, DecoratedTestForm);

      expect(onSubmit).toNotHaveBeenCalled();

      decoratedForm.submit();

      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.calls.length).toBe(1);
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 42 });
      expect(onSubmit.calls[0].arguments[1]).toBeA('function');
      expect(onSubmit.calls[0].arguments[2].values).toEqualMap({ foo: 42 });

      expect(formRender.calls.length).toBe(3);
      expect(formRender.calls[2].arguments[0].error).toBe('Invalid');
    });

    it('should NOT submit a form with sync validation errors', function () {
      var logger = (0, _expect.createSpy)(function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return state;
      }).andCallThrough();
      var store = makeStore({}, logger);
      var inputRender = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props.input);
      }).andCallThrough();
      var onSubmit = (0, _expect.createSpy)();
      var formRender = (0, _expect.createSpy)();
      var validate = function validate(values) {
        var errors = {};
        if (!getIn(values, 'foo')) {
          errors.foo = 'Required';
        }
        return errors;
      };

      var TestForm = function (_Component5) {
        _inherits(TestForm, _Component5);

        function TestForm() {
          _classCallCheck(this, TestForm);

          return _possibleConstructorReturn(this, (TestForm.__proto__ || Object.getPrototypeOf(TestForm)).apply(this, arguments));
        }

        _createClass(TestForm, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return _react2.default.createElement(
              _Form2.default,
              { onSubmit: this.props.handleSubmit(onSubmit) },
              _react2.default.createElement(Field, { name: 'foo', component: inputRender })
            );
          }
        }]);

        return TestForm;
      }(_react.Component);

      var DecoratedTestForm = reduxForm({
        form: 'testForm',
        validate: validate
      })(TestForm);
      _testUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(DecoratedTestForm, null)
      ));

      var callIndex = logger.calls.length;

      // form renders before sync validation and then again with invalid flag
      expect(formRender.calls.length).toBe(2);
      expect(propsAtNthRender(formRender, 0).invalid).toBe(false);
      expect(propsAtNthRender(formRender, 1).invalid).toBe(true);
      expect(propsAtNthRender(formRender, 1).submitFailed).toBe(false);

      // try to submit invalid form via dispatching submit action
      store.dispatch((0, _actions.submit)('testForm'));

      // check that submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.submit)('testForm'));

      // check that clear submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.clearSubmit)('testForm'));

      // check that touch action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.touch)('testForm', 'foo'));

      // check that setSubmitFailed action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.setSubmitFailed)('testForm', 'foo'));

      // form rerendered twice, once with submit trigger, and then after submit failure
      expect(formRender.calls.length).toBe(4);
      expect(propsAtNthRender(formRender, 3).invalid).toBe(true);
      expect(propsAtNthRender(formRender, 3).submitFailed).toBe(true);

      // update input
      inputRender.calls[0].arguments[0].input.onChange('hello');

      // check that change action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.change)('testForm', 'foo', 'hello', false, false));

      // check that updateSyncErrors action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.updateSyncErrors)('testForm', {}));

      // rerendered once to flip dirty flag, and again to flip invalid flag
      expect(formRender.calls.length).toBe(6);
      expect(propsAtNthRender(formRender, 3).dirty).toBe(false);
      expect(propsAtNthRender(formRender, 4).dirty).toBe(true);
      expect(propsAtNthRender(formRender, 4).invalid).toBe(true);
      expect(propsAtNthRender(formRender, 5).invalid).toBe(false);
      expect(propsAtNthRender(formRender, 5).submitFailed).toBe(true);

      // dispatch submit action on now valid form
      store.dispatch((0, _actions.submit)('testForm'));

      // check that submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.submit)('testForm'));

      // check that clear submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.clearSubmit)('testForm'));

      // check that touch action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.touch)('testForm', 'foo'));

      // check that submit succeeded action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual((0, _actions.setSubmitSucceeded)('testForm'));

      // check no additional actions dispatched
      expect(logger.calls.length).toBe(callIndex);

      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.calls.length).toBe(1);
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 'hello' });
      expect(onSubmit.calls[0].arguments[1]).toBeA('function');
      expect(onSubmit.calls[0].arguments[2].values).toEqualMap({ foo: 'hello' });
    });
  });
};

describeForm('Form.plain', _plain2.default, _redux.combineReducers, (0, _addExpectations2.default)(_expectations2.default));
describeForm('Form.immutable', _immutable2.default, _reduxImmutablejs.combineReducers, (0, _addExpectations2.default)(_expectations4.default));