var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react';
import { createSpy, spyOn } from 'expect';
import { Provider } from 'react-redux';
import { combineReducers as plainCombineReducers, createStore } from 'redux';
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs';
import TestUtils from 'react-dom/test-utils';
import createReduxForm from '../reduxForm';
import createReducer from '../reducer';
import createFields from '../Fields';
import FormSection from '../FormSection';
import plain from '../structure/plain';
import plainExpectations from '../structure/plain/expectations';
import immutable from '../structure/immutable';
import immutableExpectations from '../structure/immutable/expectations';
import addExpectations from './addExpectations';

var describeFields = function describeFields(name, structure, combineReducers, expect) {
  var reduxForm = createReduxForm(structure);
  var Fields = createFields(structure);
  var reducer = createReducer(structure);
  var fromJS = structure.fromJS,
      getIn = structure.getIn;

  var makeStore = function makeStore(initial) {
    return createStore(combineReducers({ form: reducer }), fromJS({ form: initial }));
  };

  var TestInput = function (_Component) {
    _inherits(TestInput, _Component);

    function TestInput() {
      _classCallCheck(this, TestInput);

      return _possibleConstructorReturn(this, (TestInput.__proto__ || Object.getPrototypeOf(TestInput)).apply(this, arguments));
    }

    _createClass(TestInput, [{
      key: 'render',
      value: function render() {
        return React.createElement(
          'div',
          null,
          'TEST INPUT'
        );
      }
    }]);

    return TestInput;
  }(Component);

  var testProps = function testProps(state) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var store = makeStore({ testForm: state });

    var Form = function (_Component2) {
      _inherits(Form, _Component2);

      function Form() {
        _classCallCheck(this, Form);

        return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
      }

      _createClass(Form, [{
        key: 'render',
        value: function render() {
          return React.createElement(
            'div',
            null,
            React.createElement(Fields, { names: ['foo'], component: TestInput })
          );
        }
      }]);

      return Form;
    }(Component);

    var TestForm = reduxForm(_extends({ form: 'testForm' }, config))(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(TestForm, null)
    ));
    return TestUtils.findRenderedComponentWithType(dom, TestInput).props;
  };

  describe(name, function () {
    it('should throw an error if not in ReduxForm', function () {
      expect(function () {
        TestUtils.renderIntoDocument(React.createElement(
          'div',
          null,
          React.createElement(Fields, { names: ['foo', 'bar'], component: TestInput })
        ));
      }).toThrow(/must be inside a component decorated with reduxForm/);
    });

    it('should warn if no names prop is provided', function () {
      var spy = spyOn(console, 'error'); // mutes prop type warning
      var store = makeStore();

      var Form = function (_Component3) {
        _inherits(Form, _Component3);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { component: TestInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      expect(function () {
        TestUtils.renderIntoDocument(React.createElement(
          Provider,
          { store: store },
          React.createElement(TestForm, null)
        ));
      }).toThrow(/No "names" prop was specified/);
      spy.restore();
    });

    it('should warn if invalid names prop is provided', function () {
      var spy = spyOn(console, 'error'); // mutes prop type warning
      var store = makeStore();

      var Form = function (_Component4) {
        _inherits(Form, _Component4);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: 'This is a string', component: TestInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      expect(function () {
        TestUtils.renderIntoDocument(React.createElement(
          Provider,
          { store: store },
          React.createElement(TestForm, null)
        ));
      }).toThrow(/Invalid prop "names"/);
      spy.restore();
    });

    it('should get value from Redux state', function () {
      var props = testProps({
        values: {
          foo: 'bar'
        }
      });
      expect(props.foo.input.value).toBe('bar');
    });

    it('should get meta.form', function () {
      var props = testProps({
        values: {
          foo: 'bar'
        }
      });
      expect(props.foo.meta.form).toBe('testForm');
    });

    it('should get dirty/pristine from Redux state', function () {
      var props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      });
      expect(props1.foo.meta.pristine).toBe(true);
      expect(props1.foo.meta.dirty).toBe(false);
      var props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      });
      expect(props2.foo.meta.pristine).toBe(false);
      expect(props2.foo.meta.dirty).toBe(true);
    });

    it('should allow an empty value from Redux state to be pristine', function () {
      var props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: ''
        }
      });
      expect(props1.foo.meta.pristine).toBe(false);
      expect(props1.foo.meta.dirty).toBe(true);
      var props2 = testProps({
        initial: {
          foo: ''
        },
        values: {
          foo: ''
        }
      });
      expect(props2.foo.meta.pristine).toBe(true);
      expect(props2.foo.meta.dirty).toBe(false);
    });

    it('should get asyncValidating from Redux state', function () {
      var props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        asyncValidating: 'dog'
      });
      expect(props1.foo.meta.asyncValidating).toBe(false);
      var props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        },
        asyncValidating: 'foo'
      });
      expect(props2.foo.meta.asyncValidating).toBe(true);
    });

    it('should get sync errors from outer reduxForm component', function () {
      var props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }, {
        validate: function validate() {
          return { foo: 'foo error' };
        }
      });
      expect(props.foo.meta.error).toBe('foo error');
    });

    it('should get sync warnings from outer reduxForm component', function () {
      var props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }, {
        warn: function warn() {
          return { foo: 'foo warning' };
        }
      });
      expect(props.foo.meta.warning).toBe('foo warning');
    });

    it('should get async errors from Redux state', function () {
      var props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        asyncErrors: {
          foo: 'foo error'
        }
      });
      expect(props.foo.meta.error).toBe('foo error');
    });

    it('should get submit errors from Redux state', function () {
      var props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        submitErrors: {
          foo: 'foo error'
        }
      });
      expect(props.foo.meta.error).toBe('foo error');
    });

    it('should get submitFailed prop from Redux state', function () {
      var props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        submitFailed: true
      });
      expect(props.foo.meta.submitFailed).toBe(true);
    });

    it('should provide names getter', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component5) {
        _inherits(Form, _Component5);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo', 'bar'], component: TestInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var stub = TestUtils.findRenderedComponentWithType(dom, Fields);
      expect(stub.names).toEqual(['foo', 'bar']);
    });

    it('should provide values getter', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          }
        }
      });

      var Form = function (_Component6) {
        _inherits(Form, _Component6);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo', 'bar'], component: TestInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var stub = TestUtils.findRenderedComponentWithType(dom, Fields);
      expect(stub.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    });

    it('should provide dirty getter that is true when any field is dirty', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: 'fooValue',
            bar: 'barValue'
          },
          values: {
            foo: 'fooValue',
            bar: 'barValueDirty'
          }
        }
      });

      var Form = function (_Component7) {
        _inherits(Form, _Component7);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo', 'bar'], component: TestInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var stub = TestUtils.findRenderedComponentWithType(dom, Fields);
      expect(stub.dirty).toBe(true);
    });

    it('should provide dirty getter that is false when all fields are pristine', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: 'fooValue',
            bar: 'barValue'
          },
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          }
        }
      });

      var Form = function (_Component8) {
        _inherits(Form, _Component8);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo', 'bar'], component: TestInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var stub = TestUtils.findRenderedComponentWithType(dom, Fields);
      expect(stub.dirty).toBe(false);
    });

    it('should provide pristine getter that is false when dirty', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component9) {
        _inherits(Form, _Component9);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo'], component: TestInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var stub = TestUtils.findRenderedComponentWithType(dom, Fields);
      expect(stub.pristine).toBe(false);
    });

    it('should provide pristine getter that is true when pristine', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component10) {
        _inherits(Form, _Component10);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo'], component: TestInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var stub = TestUtils.findRenderedComponentWithType(dom, Fields);
      expect(stub.pristine).toBe(true);
    });

    it('should have value set to initial value on first render', function () {
      var store = makeStore({});
      var input = createSpy(function (props) {
        return React.createElement('input', props.foo.input);
      }).andCallThrough();

      var Form = function (_Component11) {
        _inherits(Form, _Component11);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo', 'bar'], component: input })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm'
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].foo.input.value).toBe('fooValue');
      expect(input.calls[0].arguments[0].bar.input.value).toBe('barValue');
    });

    it('should provide sync error for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var validate = function validate() {
        return { foo: ['first error', 'second error'] };
      };

      var Form = function (_Component12) {
        _inherits(Form, _Component12);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo[0]', 'foo[1]'], component: input })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        validate: validate
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].foo[0].meta.valid).toBe(false);
      expect(input.calls[0].arguments[0].foo[0].meta.error).toBe('first error');
      expect(input.calls[0].arguments[0].foo[1].meta.valid).toBe(false);
      expect(input.calls[0].arguments[0].foo[1].meta.error).toBe('second error');
    });

    it('should provide sync error for array-of-objects field', function () {
      var store = makeStore({
        testForm: {
          values: {
            authors: [{
              firstName: 'Erik',
              lastName: 'Rasmussen'
            }]
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var validate = function validate() {
        return {
          authors: [{ _error: 'Object Error' }]
        };
      };

      var Form = function (_Component13) {
        _inherits(Form, _Component13);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['authors[0]'], component: input })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        validate: validate
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].authors[0].meta.valid).toBe(false);
      expect(input.calls[0].arguments[0].authors[0].meta.error).toBe('Object Error');
    });

    it('should provide sync warning for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var warn = function warn() {
        return { foo: ['first warning', 'second warning'] };
      };

      var Form = function (_Component14) {
        _inherits(Form, _Component14);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo[0]', 'foo[1]'], component: input })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        warn: warn
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].foo[0].meta.warning).toBe('first warning');
      expect(input.calls[0].arguments[0].foo[1].meta.warning).toBe('second warning');
    });

    it('should provide sync warning for array-of-objects field', function () {
      var store = makeStore({
        testForm: {
          values: {
            authors: [{
              firstName: 'Erik',
              lastName: 'Rasmussen'
            }]
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var warn = function warn() {
        return {
          authors: [{ _warning: 'Object Error' }]
        };
      };

      var Form = function (_Component15) {
        _inherits(Form, _Component15);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['authors[0]'], component: input })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        warn: warn
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].authors[0].meta.warning).toBe('Object Error');
    });

    it('should provide access to rendered component', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          }
        }
      });

      var Form = function (_Component16) {
        _inherits(Form, _Component16);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo', 'bar'], component: TestInput, withRef: true })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var field = TestUtils.findRenderedComponentWithType(dom, Fields);
      var input = TestUtils.findRenderedComponentWithType(dom, TestInput);

      expect(field.getRenderedComponent()).toBe(input);
    });

    it('should unregister fields when unmounted', function () {
      var store = makeStore();
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function (_Component17) {
        _inherits(Form, _Component17);

        function Form() {
          _classCallCheck(this, Form);

          var _this17 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this17.state = { toggle: false };
          return _this17;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this18 = this;

            var toggle = this.state.toggle;

            return React.createElement(
              'div',
              null,
              !toggle && React.createElement(Fields, { names: ['dog', 'cat'], component: input }),
              toggle && React.createElement(Fields, { names: ['cow', 'ewe'], component: input }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this18.setState({ toggle: true });
                  } },
                'Toggle'
              )
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              dog: { name: 'dog', type: 'Field', count: 1 },
              cat: { name: 'cat', type: 'Field', count: 1 }
            }
          }
        }
      });

      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              cow: { name: 'cow', type: 'Field', count: 1 },
              ewe: { name: 'ewe', type: 'Field', count: 1 }
            }
          }
        }
      });
    });

    it('should reconnect when names change', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          },
          fields: {
            bar: {
              touched: true
            }
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function (_Component18) {
        _inherits(Form, _Component18);

        function Form() {
          _classCallCheck(this, Form);

          var _this19 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this19.state = { field: 'foo' };
          return _this19;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this20 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: [this.state.field], component: input }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this20.setState({ field: 'bar' });
                  } },
                'Change'
              )
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].foo.input.value).toBe('fooValue');
      expect(input.calls[0].arguments[0].foo.meta.touched).toBe(false);

      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].bar.input.value).toBe('barValue');
      expect(input.calls[1].arguments[0].bar.meta.touched).toBe(true);
    });

    it('should prefix name getter when inside FormSection', function () {
      var store = makeStore();
      var renderFields = function renderFields(_ref) {
        var foo = _ref.foo,
            bar = _ref.bar;
        return React.createElement(
          'div',
          null,
          React.createElement('input', foo.input),
          React.createElement('input', bar.input)
        );
      };

      var Form = function (_Component19) {
        _inherits(Form, _Component19);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              FormSection,
              { name: 'foo' },
              React.createElement(Fields, { names: ['foo', 'bar'], component: renderFields })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var stub = TestUtils.findRenderedComponentWithType(dom, Fields);
      expect(stub.names).toEqual(['foo.foo', 'foo.bar']);
    });
    it('should prefix name getter when inside multiple FormSection', function () {
      var store = makeStore();
      var renderFields = function renderFields(_ref2) {
        var foo = _ref2.foo,
            bar = _ref2.bar;
        return React.createElement(
          'div',
          null,
          React.createElement('input', foo.input),
          React.createElement('input', bar.input)
        );
      };

      var Form = function (_Component20) {
        _inherits(Form, _Component20);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              FormSection,
              { name: 'foo' },
              React.createElement(
                FormSection,
                { name: 'fighter' },
                React.createElement(Fields, { names: ['foo', 'bar'], component: renderFields })
              )
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var stub = TestUtils.findRenderedComponentWithType(dom, Fields);
      expect(stub.names).toEqual(['foo.fighter.foo', 'foo.fighter.bar']);
    });

    it('should prefix name when inside FormSection', function () {
      var store = makeStore();
      var renderFields = function renderFields(_ref3) {
        var foo = _ref3.foo,
            bar = _ref3.bar;
        return React.createElement(
          'div',
          null,
          React.createElement('input', foo.input),
          React.createElement('input', bar.input)
        );
      };

      var Form = function (_Component21) {
        _inherits(Form, _Component21);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              FormSection,
              { name: 'foo' },
              React.createElement(Fields, { names: ['foo', 'bar'], component: renderFields })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              'foo.foo': { name: 'foo.foo', type: 'Field', count: 1 },
              'foo.bar': { name: 'foo.bar', type: 'Field', count: 1 }
            }
          }
        }
      });
    });

    it('should prefix name when inside multiple FormSections', function () {
      var store = makeStore();
      var renderFields = function renderFields(_ref4) {
        var foo = _ref4.foo,
            bar = _ref4.bar;
        return React.createElement(
          'div',
          null,
          React.createElement('input', foo.input),
          React.createElement('input', bar.input)
        );
      };

      var Form = function (_Component22) {
        _inherits(Form, _Component22);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              FormSection,
              { name: 'foo' },
              React.createElement(
                FormSection,
                { name: 'fighter' },
                React.createElement(Fields, { names: ['foo', 'bar'], component: renderFields })
              )
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              'foo.fighter.foo': { name: 'foo.fighter.foo', type: 'Field', count: 1 },
              'foo.fighter.bar': { name: 'foo.fighter.bar', type: 'Field', count: 1 }
            }
          }
        }
      });
    });

    it('should rerender when props change', function () {
      var store = makeStore();
      var renderFields = createSpy(function (props) {
        return React.createElement(
          'div',
          null,
          props.highlighted,
          React.createElement('input', props.foo.input)
        );
      }).andCallThrough();

      var Form = function (_Component23) {
        _inherits(Form, _Component23);

        function Form() {
          _classCallCheck(this, Form);

          var _this25 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this25.state = { highlighted: 0 };
          return _this25;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this26 = this;

            var highlighted = this.state.highlighted;

            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['foo'], highlighted: highlighted, component: renderFields }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this26.setState({ highlighted: highlighted + 1 });
                  } },
                'Change'
              )
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      expect(renderFields).toHaveBeenCalled();
      expect(renderFields.calls.length).toBe(1);
      expect(renderFields.calls[0].arguments[0].highlighted).toBe(0);

      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(renderFields.calls.length).toBe(2);
      expect(renderFields.calls[1].arguments[0].highlighted).toBe(1);
    });

    it('should NOT rerender when props.props is shallow-equal, but !==', function () {
      var store = makeStore();
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderSpy = createSpy();

      var Form = function (_Component24) {
        _inherits(Form, _Component24);

        function Form() {
          _classCallCheck(this, Form);

          var _this27 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this27.state = { foo: 'bar' };
          return _this27;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this28 = this;

            renderSpy();
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['myField'], component: input, props: { rel: 'test' } }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this28.setState({ foo: 'qux' });
                  } },
                'Change'
              )
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      expect(renderSpy).toHaveBeenCalled();
      expect(renderSpy.calls.length).toBe(1);

      expect(input).toHaveBeenCalled();
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].rel).toBe('test');

      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(renderSpy.calls.length).toBe(2);

      expect(input.calls.length).toBe(1);
    });

    it('should rerender when one of the fields changes', function () {
      var store = makeStore({
        testForm: {
          values: {
            cat: 'catValue',
            dog: 'dogValue',
            ewe: 'eweValue',
            fox: 'foxValue'
          }
        }
      });
      var inputPair1 = createSpy(function (_ref5) {
        var cat = _ref5.cat,
            dog = _ref5.dog;
        return React.createElement(
          'div',
          null,
          React.createElement('input', cat.input),
          React.createElement('input', dog.input)
        );
      }).andCallThrough();
      var inputPair2 = createSpy(function (_ref6) {
        var ewe = _ref6.ewe,
            fox = _ref6.fox;
        return React.createElement(
          'div',
          null,
          React.createElement('input', ewe.input),
          React.createElement('input', fox.input)
        );
      }).andCallThrough();

      var Form = function (_Component25) {
        _inherits(Form, _Component25);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['cat', 'dog'], component: inputPair1 }),
              React.createElement(Fields, { names: ['ewe', 'fox'], component: inputPair2 })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      expect(inputPair1).toHaveBeenCalled();
      expect(inputPair1.calls.length).toBe(1);
      expect(inputPair1.calls[0].arguments[0].cat.input.value).toBe('catValue');
      expect(inputPair1.calls[0].arguments[0].dog.input.value).toBe('dogValue');

      expect(inputPair2).toHaveBeenCalled();
      expect(inputPair2.calls.length).toBe(1);
      expect(inputPair2.calls[0].arguments[0].ewe.input.value).toBe('eweValue');
      expect(inputPair2.calls[0].arguments[0].fox.input.value).toBe('foxValue');

      inputPair1.calls[0].arguments[0].dog.input.onChange('FIDO');

      // input pair 1 should be rerendered
      expect(inputPair1.calls.length).toBe(2);
      expect(inputPair1.calls[1].arguments[0].cat.input.value).toBe('catValue');
      expect(inputPair1.calls[1].arguments[0].dog.input.value).toBe('FIDO');

      // input pair 2 should NOT be rerendered
      expect(inputPair2.calls.length).toBe(1);
    });

    it('should call format function on first render', function () {
      var store = makeStore({
        testForm: {
          values: {
            name: 'Redux Form'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var format = createSpy(function (value) {
        return value.toLowerCase();
      }).andCallThrough();

      var Form = function (_Component26) {
        _inherits(Form, _Component26);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['name'], component: input, format: format })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      expect(format).toHaveBeenCalled();
      expect(format.calls.length).toBe(1);
      expect(format.calls[0].arguments).toEqual(['Redux Form', 'name']);

      expect(input.calls[0].arguments[0].name.input.value).toBe('redux form');
    });

    it('should call parse function on change', function () {
      var store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var parse = createSpy(function (value) {
        return value.toLowerCase();
      }).andCallThrough();

      var Form = function (_Component27) {
        _inherits(Form, _Component27);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['name'], component: input, parse: parse })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      expect(parse).toNotHaveBeenCalled();

      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].name.input.value).toBe('redux form');

      input.calls[0].arguments[0].name.input.onChange('REDUX FORM ROCKS');

      expect(parse).toHaveBeenCalled();
      expect(parse.calls.length).toBe(1);
      expect(parse.calls[0].arguments).toEqual(['REDUX FORM ROCKS', 'name']);

      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].name.input.value).toBe('redux form rocks');
    });

    it('should call parse function on blur', function () {
      var store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var parse = createSpy(function (value) {
        return value.toLowerCase();
      }).andCallThrough();

      var Form = function (_Component28) {
        _inherits(Form, _Component28);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['name'], component: input, parse: parse })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      expect(parse).toNotHaveBeenCalled();

      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].name.input.value).toBe('redux form');

      input.calls[0].arguments[0].name.input.onBlur('REDUX FORM ROCKS');

      expect(parse).toHaveBeenCalled();
      expect(parse.calls.length).toBe(1);
      expect(parse.calls[0].arguments).toEqual(['REDUX FORM ROCKS', 'name']);

      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].name.input.value).toBe('redux form rocks');
    });

    it('should handle on focus', function () {
      var store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function (_Component29) {
        _inherits(Form, _Component29);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['name'], component: input })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].name.meta.visited).toBe(false);

      input.calls[0].arguments[0].name.input.onFocus();

      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].name.meta.visited).toBe(true);
    });

    it('should parse and format to maintain different type in store', function () {
      var store = makeStore({
        testForm: {
          values: {
            age: 42
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var parse = createSpy(function (value) {
        return value && parseInt(value, 10);
      }).andCallThrough();
      var format = createSpy(function (value) {
        return value && value.toString();
      }).andCallThrough();

      var Form = function (_Component30) {
        _inherits(Form, _Component30);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['age'], component: input, format: format, parse: parse })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      // format called once
      expect(format).toHaveBeenCalled();
      expect(format.calls.length).toBe(1);

      // parse not called yet
      expect(parse).toNotHaveBeenCalled();

      // input displaying string value
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].age.input.value).toBe('42');

      // update value
      input.calls[0].arguments[0].age.input.onChange('15');

      // parse was called
      expect(parse).toHaveBeenCalled();
      expect(parse.calls.length).toBe(1);
      expect(parse.calls[0].arguments).toEqual(['15', 'age']);

      // value in store is number
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              age: 15 // number
            },
            registeredFields: { age: { name: 'age', type: 'Field', count: 1 } }
          }
        }
      });

      // format called again
      expect(format).toHaveBeenCalled();
      expect(format.calls.length).toBe(2);
      expect(format.calls[1].arguments).toEqual([15, 'age']);

      // input rerendered with string value
      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].age.input.value).toBe('15');
    });

    it('should rerender when sync error changes', function () {
      var store = makeStore({
        testForm: {
          values: {
            password: 'redux-form sucks',
            confirm: 'redux-form rocks'
          }
        }
      });
      var passwordInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var confirmInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var validate = function validate(values) {
        var password = getIn(values, 'password');
        var confirm = getIn(values, 'confirm');
        return password === confirm ? {} : { confirm: 'Must match!' };
      };

      var Form = function (_Component31) {
        _inherits(Form, _Component31);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['password'], component: passwordInput }),
              React.createElement(Fields, { names: ['confirm'], component: confirmInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        validate: validate
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      // password input rendered
      expect(passwordInput).toHaveBeenCalled();
      expect(passwordInput.calls.length).toBe(1);

      // confirm input rendered with error
      expect(confirmInput).toHaveBeenCalled();
      expect(confirmInput.calls.length).toBe(1);
      expect(confirmInput.calls[0].arguments[0].confirm.meta.valid).toBe(false);
      expect(confirmInput.calls[0].arguments[0].confirm.meta.error).toBe('Must match!');

      // update password field so that they match
      passwordInput.calls[0].arguments[0].password.input.onChange('redux-form rocks');

      // password input rerendered
      expect(passwordInput.calls.length).toBe(2);

      // confirm input should also rerender, but with no error
      expect(confirmInput.calls.length).toBe(2);
      expect(confirmInput.calls[1].arguments[0].confirm.meta.valid).toBe(true);
      expect(confirmInput.calls[1].arguments[0].confirm.meta.error).toBe(undefined);
    });

    it('should rerender when sync error is cleared', function () {
      var store = makeStore();
      var usernameInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var validate = function validate(values) {
        var username = getIn(values, 'username');
        return username ? {} : { username: 'Required' };
      };

      var Form = function (_Component32) {
        _inherits(Form, _Component32);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['username'], component: usernameInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        validate: validate
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      // username input rendered
      expect(usernameInput).toHaveBeenCalled();
      expect(usernameInput.calls.length).toBe(1);

      // username field has error
      expect(usernameInput.calls[0].arguments[0].username.meta.valid).toBe(false);
      expect(usernameInput.calls[0].arguments[0].username.meta.error).toBe('Required');

      // update username field so it passes
      usernameInput.calls[0].arguments[0].username.input.onChange('erikras');

      // username input rerendered
      expect(usernameInput.calls.length).toBe(2);

      // should be valid now
      expect(usernameInput.calls[1].arguments[0].username.meta.valid).toBe(true);
      expect(usernameInput.calls[1].arguments[0].username.meta.error).toBe(undefined);
    });

    it('should rerender when sync warning changes', function () {
      var store = makeStore({
        testForm: {
          values: {
            password: 'redux-form sucks',
            confirm: 'redux-form rocks'
          }
        }
      });
      var passwordInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var confirmInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var warn = function warn(values) {
        var password = getIn(values, 'password');
        var confirm = getIn(values, 'confirm');
        return password === confirm ? {} : { confirm: 'Should match. Or not. Whatever.' };
      };

      var Form = function (_Component33) {
        _inherits(Form, _Component33);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['password'], component: passwordInput }),
              React.createElement(Fields, { names: ['confirm'], component: confirmInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        warn: warn
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      // password input rendered
      expect(passwordInput).toHaveBeenCalled();
      expect(passwordInput.calls.length).toBe(1);

      // confirm input rendered with warning
      expect(confirmInput).toHaveBeenCalled();
      expect(confirmInput.calls.length).toBe(1);
      expect(confirmInput.calls[0].arguments[0].confirm.meta.warning).toBe('Should match. Or not. Whatever.');

      // update password field so that they match
      passwordInput.calls[0].arguments[0].password.input.onChange('redux-form rocks');

      // password input rerendered
      expect(passwordInput.calls.length).toBe(2);

      // confirm input should also rerender, but with no warning
      expect(confirmInput.calls.length).toBe(2);
      expect(confirmInput.calls[1].arguments[0].confirm.meta.warning).toBe(undefined);
    });

    it('should rerender when sync warning is cleared', function () {
      var store = makeStore();
      var usernameInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var warn = function warn(values) {
        var username = getIn(values, 'username');
        return username ? {} : { username: 'Recommended' };
      };

      var Form = function (_Component34) {
        _inherits(Form, _Component34);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, { names: ['username'], component: usernameInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        warn: warn
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      // username input rendered
      expect(usernameInput).toHaveBeenCalled();
      expect(usernameInput.calls.length).toBe(1);

      // username field has warning
      expect(usernameInput.calls[0].arguments[0].username.meta.warning).toBe('Recommended');

      // update username field so it passes
      usernameInput.calls[0].arguments[0].username.input.onChange('erikras');

      // username input rerendered
      expect(usernameInput.calls.length).toBe(2);

      // should be valid now
      expect(usernameInput.calls[1].arguments[0].username.meta.warning).toBe(undefined);
    });

    it('should provide correct prop structure', function () {
      var store = makeStore();
      var renderFields = createSpy(function () {
        return React.createElement('div', null);
      }).andCallThrough();

      var Form = function (_Component35) {
        _inherits(Form, _Component35);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, {
                names: ['foo', 'bar', 'deep.dive', 'array[0]', 'array[1]'],
                component: renderFields,
                someCustomProp: 'testing',
                anotherCustomProp: 42,
                customBooleanFlag: true })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      expect(renderFields).toHaveBeenCalled();
      var fields = renderFields.calls[0].arguments[0];

      var expectField = function expectField(field) {
        expect(field).toExist();
        expect(field.input).toExist();
        expect(field.input.onChange).toBeA('function');
        expect(field.input.onBlur).toBeA('function');
        expect(field.input.onFocus).toBeA('function');
        expect(field.meta).toExist();
        expect(field.meta.pristine).toBe(true);
        expect(field.meta.dirty).toBe(false);
        expect(field.someCustomProp).toNotExist();
        expect(field.anotherCustomProp).toNotExist();
        expect(field.customBooleanFlag).toNotExist();
      };

      expectField(fields.foo);
      expectField(fields.bar);
      expect(fields.deep).toExist();
      expectField(fields.deep.dive);
      expect(fields.array).toExist();
      expectField(fields.array[0]);
      expectField(fields.array[1]);
      expect(fields.someCustomProp).toBe('testing');
      expect(fields.anotherCustomProp).toBe(42);
      expect(fields.customBooleanFlag).toBe(true);
    });

    it('should provide correct prop structure after names change', function () {
      var store = makeStore();
      var renderFields = createSpy(function () {
        return React.createElement('div', null);
      }).andCallThrough();

      var Form = function (_Component36) {
        _inherits(Form, _Component36);

        function Form(props) {
          _classCallCheck(this, Form);

          var _this40 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

          _this40.state = { names: ['foo', 'bar', 'deep.dive', 'array[0]'] };
          _this40.changeNames = _this40.changeNames.bind(_this40);
          return _this40;
        }

        _createClass(Form, [{
          key: 'changeNames',
          value: function changeNames() {
            this.setState({ names: ['fighter', 'fly.high', 'array[1]'] });
          }
        }, {
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, {
                names: this.state.names,
                component: renderFields,
                someCustomProp: 'testing',
                anotherCustomProp: 42,
                customBooleanFlag: true }),
              React.createElement('button', { type: 'button', onClick: this.changeNames })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);
      expect(renderFields).toHaveBeenCalled();
      expect(renderFields.calls.length).toBe(2);
      var fields = renderFields.calls[1].arguments[0];

      var expectField = function expectField(field) {
        expect(field).toExist();
        expect(field.input).toExist();
        expect(field.input.onChange).toBeA('function');
        expect(field.input.onBlur).toBeA('function');
        expect(field.input.onFocus).toBeA('function');
        expect(field.meta).toExist();
        expect(field.meta.pristine).toBe(true);
        expect(field.meta.dirty).toBe(false);
        expect(field.someCustomProp).toNotExist();
        expect(field.anotherCustomProp).toNotExist();
        expect(field.customBooleanFlag).toNotExist();
      };

      expectField(fields.fighter);
      expect(fields.fly).toExist();
      expectField(fields.fly.high);
      expect(fields.array).toExist();
      expectField(fields.array[1]);
      expect(fields.someCustomProp).toBe('testing');
      expect(fields.anotherCustomProp).toBe(42);
      expect(fields.customBooleanFlag).toBe(true);

      expect(fields.foo).toNotExist();
      expect(fields.bar).toNotExist();
      expect(fields.deep).toNotExist();
      expect(fields.array[0]).toNotExist();
    });

    it('should reassign event handlers when names change', function () {
      var store = makeStore();
      var renderFields = createSpy(function () {
        return React.createElement('div', null);
      }).andCallThrough();

      var Form = function (_Component37) {
        _inherits(Form, _Component37);

        function Form(props) {
          _classCallCheck(this, Form);

          var _this41 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

          _this41.state = { names: ['foo', 'bar', 'deep.dive', 'array[0]'] };
          _this41.changeNames = _this41.changeNames.bind(_this41);
          return _this41;
        }

        _createClass(Form, [{
          key: 'changeNames',
          value: function changeNames() {
            this.setState({ names: ['fighter', 'fly.high', 'array[1]'] });
          }
        }, {
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(Fields, {
                names: this.state.names,
                component: renderFields,
                someCustomProp: 'testing',
                anotherCustomProp: 42,
                customBooleanFlag: true }),
              React.createElement('button', { type: 'button', onClick: this.changeNames })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');

      expect(renderFields).toHaveBeenCalled();
      expect(renderFields.calls.length).toBe(1);

      // foo is inactive
      expect(renderFields.calls[0].arguments[0].foo.meta.active).toBe(false);

      // focus on foo
      renderFields.calls[0].arguments[0].foo.input.onFocus();

      // foo is active
      expect(renderFields.calls.length).toBe(2);
      expect(renderFields.calls[1].arguments[0].foo.meta.active).toBe(true);
      expect(renderFields.calls[1].arguments[0].foo.input.value).toBe('');

      // change foo
      renderFields.calls[1].arguments[0].foo.input.onChange('erikras');

      // foo is changed
      expect(renderFields.calls.length).toBe(3);
      expect(renderFields.calls[2].arguments[0].foo.meta.active).toBe(true);
      expect(renderFields.calls[2].arguments[0].foo.input.value).toBe('erikras');

      // blur foo
      renderFields.calls[2].arguments[0].foo.input.onBlur('@erikras');

      // foo is blurred
      expect(renderFields.calls.length).toBe(4);
      expect(renderFields.calls[3].arguments[0].foo.meta.active).toBe(false);
      expect(renderFields.calls[3].arguments[0].foo.input.value).toBe('@erikras');

      // swap out fields
      TestUtils.Simulate.click(button);

      // original fields gone
      expect(renderFields.calls.length).toBe(5);
      expect(renderFields.calls[4].arguments[0].foo).toNotExist();
      expect(renderFields.calls[4].arguments[0].fighter).toExist();

      // fighter is inactive
      expect(renderFields.calls[4].arguments[0].fighter.meta.active).toBe(false);

      // focus on fighter
      renderFields.calls[4].arguments[0].fighter.input.onFocus();

      // fighter is active
      expect(renderFields.calls.length).toBe(6);
      expect(renderFields.calls[5].arguments[0].fighter.meta.active).toBe(true);
      expect(renderFields.calls[5].arguments[0].fighter.input.value).toBe('');

      // change fighter
      renderFields.calls[5].arguments[0].fighter.input.onChange('reduxForm');

      // fighter is changed
      expect(renderFields.calls.length).toBe(7);
      expect(renderFields.calls[6].arguments[0].fighter.meta.active).toBe(true);
      expect(renderFields.calls[6].arguments[0].fighter.input.value).toBe('reduxForm');

      // blur fighter
      renderFields.calls[6].arguments[0].fighter.input.onBlur('@reduxForm');

      // fighter is blurred
      expect(renderFields.calls.length).toBe(8);
      expect(renderFields.calls[7].arguments[0].fighter.meta.active).toBe(false);
      expect(renderFields.calls[7].arguments[0].fighter.input.value).toBe('@reduxForm');
    });
  });
};

describeFields('Fields.plain', plain, plainCombineReducers, addExpectations(plainExpectations));
describeFields('Fields.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations));