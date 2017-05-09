var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import domExpect, { createSpy } from 'expect';
import expectElement from 'expect-element';
/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react';
import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { combineReducers as plainCombineReducers, createStore } from 'redux';
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs';
import createField from '../Field';
import createFieldArray from '../FieldArray';
import createFields from '../Fields';
import FormSection from '../FormSection';
import createReducer from '../reducer';
import createReduxForm from '../reduxForm';
import immutable from '../structure/immutable';
import immutableExpectations from '../structure/immutable/expectations';
import plain from '../structure/plain';
import plainExpectations from '../structure/plain/expectations';
import addExpectations from './addExpectations';

domExpect.extend(expectElement);

var describeFieldArray = function describeFieldArray(name, structure, combineReducers, expect) {
  var reduxForm = createReduxForm(structure);
  var FieldArray = createFieldArray(structure);
  var Field = createField(structure);
  var Fields = createFields(structure);
  var reducer = createReducer(structure);
  var allowsArrayErrors = structure.allowsArrayErrors,
      fromJS = structure.fromJS,
      getIn = structure.getIn,
      size = structure.size;

  var makeStore = function makeStore(initial) {
    return createStore(combineReducers({ form: reducer }), fromJS({ form: initial }));
  };

  var TestComponent = function (_Component) {
    _inherits(TestComponent, _Component);

    function TestComponent() {
      _classCallCheck(this, TestComponent);

      return _possibleConstructorReturn(this, (TestComponent.__proto__ || Object.getPrototypeOf(TestComponent)).apply(this, arguments));
    }

    _createClass(TestComponent, [{
      key: 'render',
      value: function render() {
        return React.createElement(
          'div',
          null,
          'TEST INPUT'
        );
      }
    }]);

    return TestComponent;
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
            React.createElement(FieldArray, { name: 'foo', component: TestComponent })
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
    return TestUtils.findRenderedComponentWithType(dom, TestComponent).props;
  };

  describe(name, function () {
    it('should throw an error if not in ReduxForm', function () {
      expect(function () {
        TestUtils.renderIntoDocument(React.createElement(
          'div',
          null,
          React.createElement(FieldArray, { name: 'foo', component: TestComponent })
        ));
      }).toThrow(/must be inside a component decorated with reduxForm/);
    });

    it('should get length from Redux state', function () {
      var props = testProps({
        values: {
          foo: ['a', 'b', 'c']
        }
      });
      expect(props.fields.length).toBe(3);
    });

    it('should be okay with no array value', function () {
      var iterate = createSpy();
      var props = testProps({
        values: {}
      });
      expect(props.fields.length).toBe(0);
      props.fields.forEach(iterate);
      props.fields.map(iterate);
      expect(iterate).toNotHaveBeenCalled();
    });

    it('should get dirty/pristine from Redux state', function () {
      var props1 = testProps({
        initial: {
          foo: ['a', 'b', 'c']
        },
        values: {
          foo: ['a', 'b', 'c']
        }
      });
      expect(props1.meta.pristine).toBe(true);
      expect(props1.meta.dirty).toBe(false);
      var props2 = testProps({
        initial: {
          foo: ['a', 'b', 'c']
        },
        values: {
          foo: ['a', 'b']
        }
      });
      expect(props2.meta.pristine).toBe(false);
      expect(props2.meta.dirty).toBe(true);
    });

    it('should provided meta.form', function () {
      var props = testProps({});
      expect(props.meta.form).toBe('testForm');
    });

    it('should get touched from Redux state', function () {
      var props1 = testProps({
        values: {
          foo: 'bar'
        }
      });
      expect(props1.meta.touched).toBe(false);
      var props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            touched: true
          }
        }
      });
      expect(props2.meta.touched).toBe(true);
    });

    it('should not pass api props into custom', function () {
      var store = makeStore();
      var renderSpy = createSpy();

      var ArrayComponent = function (_Component3) {
        _inherits(ArrayComponent, _Component3);

        function ArrayComponent() {
          _classCallCheck(this, ArrayComponent);

          return _possibleConstructorReturn(this, (ArrayComponent.__proto__ || Object.getPrototypeOf(ArrayComponent)).apply(this, arguments));
        }

        _createClass(ArrayComponent, [{
          key: 'render',
          value: function render() {
            renderSpy(this.props);
            return React.createElement('div', null);
          }
        }]);

        return ArrayComponent;
      }(Component);

      var apiProps = {
        // all the official API props you can pass to Field
        component: ArrayComponent,
        name: 'foo',
        props: {},
        validate: function validate() {
          return undefined;
        },
        warn: function warn() {
          return undefined;
        },
        withRef: true
      };

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
              React.createElement(FieldArray, apiProps)
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
        React.createElement(TestForm, null)
      ));

      expect(renderSpy).toHaveBeenCalled();
      var props = renderSpy.calls[0].arguments[0];
      Object.keys(apiProps).forEach(function (key) {
        return expect(props[key]).toNotExist();
      });
    });

    it('should provide name', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.name).toBe('foo');
    });
    it('should prefix name when inside FormSection', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: []
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
              React.createElement(
                FormSection,
                { name: 'foo' },
                React.createElement(FieldArray, { name: 'bar', component: TestComponent })
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
      var props = TestUtils.findRenderedComponentWithType(dom, TestComponent).props;
      expect(props.fields.name).toBe('foo.bar');
    });
    it('should provide forEach', function () {
      var props = testProps({
        values: {
          foo: ['a', 'b', 'c']
        }
      });
      expect(props.fields.forEach).toBeA('function');
      var iterate = createSpy();
      props.fields.forEach(iterate);
      expect(iterate).toHaveBeenCalled();
      expect(iterate.calls.length).toBe(3);
      expect(iterate.calls[0].arguments).toEqual(['foo[0]', 0, props.fields]);
      expect(iterate.calls[1].arguments).toEqual(['foo[1]', 1, props.fields]);
      expect(iterate.calls[2].arguments).toEqual(['foo[2]', 2, props.fields]);
    });

    it('should provide map', function () {
      var props = testProps({
        values: {
          foo: ['a', 'b', 'c']
        }
      });
      expect(props.fields.map).toBeA('function');
      var iterate = createSpy();
      props.fields.map(iterate);
      expect(iterate).toHaveBeenCalled();
      expect(iterate.calls.length).toBe(3);
      expect(iterate.calls[0].arguments).toEqual(['foo[0]', 0, props.fields]);
      expect(iterate.calls[1].arguments).toEqual(['foo[1]', 1, props.fields]);
      expect(iterate.calls[2].arguments).toEqual(['foo[2]', 2, props.fields]);
    });

    it('should provide insert', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.insert).toBeA('function');
    });

    it('should provide push', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.push).toBeA('function');
    });

    it('should provide pop', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.pop).toBeA('function');
    });

    it('should provide shift', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.shift).toBeA('function');
    });

    it('should provide unshift', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.unshift).toBeA('function');
    });

    it('should provide move', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.move).toBeA('function');
    });

    it('should provide remove', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.remove).toBeA('function');
    });

    it('should provide removeAll', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.removeAll).toBeA('function');
    });

    it('should provide swap', function () {
      var props = testProps({
        values: {
          foo: []
        }
      });
      expect(props.fields.swap).toBeA('function');
    });

    it('should provide pass through other props', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      });
      var renderArray = createSpy(function () {
        return React.createElement('div', null);
      }).andCallThrough();

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
              React.createElement(FieldArray, {
                name: 'foo',
                component: renderArray,
                otherProp: 'dog',
                anotherProp: 'cat'
              })
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
      expect(renderArray).toHaveBeenCalled();
      expect(renderArray.calls.length).toBe(1);
      expect(renderArray.calls[0].arguments[0].fields.length).toBe(1);
      expect(renderArray.calls[0].arguments[0].otherProp).toBe('dog');
      expect(renderArray.calls[0].arguments[0].anotherProp).toBe('cat');
    });

    it('should provide access to rendered component', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      });

      var TestComponent = function (_Component7) {
        _inherits(TestComponent, _Component7);

        function TestComponent() {
          _classCallCheck(this, TestComponent);

          return _possibleConstructorReturn(this, (TestComponent.__proto__ || Object.getPrototypeOf(TestComponent)).apply(this, arguments));
        }

        _createClass(TestComponent, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              'TEST INPUT'
            );
          }
        }]);

        return TestComponent;
      }(Component);

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
              React.createElement(FieldArray, { name: 'foo', component: TestComponent, withRef: true })
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
      var field = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      var component = TestUtils.findRenderedComponentWithType(dom, TestComponent);

      expect(field.getRenderedComponent()).toBe(component);
    });

    it('should use initialValues', function () {
      var props = testProps({}, {
        initialValues: {
          foo: ['a', 'b', 'c']
        }
      });
      expect(props.fields.length).toBe(3);
      var iterate = createSpy();
      props.fields.forEach(iterate);
      expect(iterate).toHaveBeenCalled();
      expect(iterate.calls.length).toBe(3);
      expect(iterate.calls[0].arguments[0]).toBe('foo[0]');
      expect(iterate.calls[1].arguments[0]).toBe('foo[1]');
      expect(iterate.calls[2].arguments[0]).toBe('foo[2]');
    });

    it('should get sync errors from outer reduxForm component', function () {
      var props = testProps({
        values: {
          foo: ['bar']
        }
      }, {
        validate: function validate() {
          return { foo: { _error: 'foo error' } };
        }
      });
      expect(props.meta.error).toBe('foo error');
    });

    it('should get sync warnings from outer reduxForm component', function () {
      var props = testProps({
        values: {
          foo: ['bar']
        }
      }, {
        warn: function warn() {
          return { foo: { _warning: 'foo warning' } };
        }
      });
      expect(props.meta.warning).toBe('foo warning');
    });

    it('should get async errors from Redux state', function () {
      var props = testProps({
        values: {
          foo: ['bar']
        },
        asyncErrors: {
          foo: {
            _error: 'foo error'
          }
        }
      });
      expect(props.meta.error).toBe('foo error');
    });

    it('should get submit errors from Redux state', function () {
      var props = testProps({
        values: {
          foo: ['bar']
        },
        submitErrors: {
          foo: {
            _error: 'foo error'
          }
        }
      });
      expect(props.meta.error).toBe('foo error');
    });

    it('should get submitFailed from Redux state', function () {
      var props = testProps({
        values: {
          foo: ['bar']
        },
        submitFailed: true
      });
      expect(props.meta.submitFailed).toBe(true);
    });

    it('should provide name getter', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
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
              React.createElement(FieldArray, { name: 'foo', component: TestComponent })
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
      var stub = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      expect(stub.name).toEqual('foo');
    });

    it('should provide value getter', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
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
              React.createElement(FieldArray, { name: 'foo', component: TestComponent })
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
      var stub = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      expect(stub.value).toEqualMap(['bar']);
    });

    it('should provide dirty getter that is true when dirty', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: ['dog']
          },
          values: {
            foo: ['cat']
          }
        }
      });

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
              React.createElement(FieldArray, { name: 'foo', component: TestComponent })
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
      var stub = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      expect(stub.dirty).toBe(true);
    });

    it('should provide dirty getter that is false when pristine', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: ['dog']
          },
          values: {
            foo: ['dog']
          }
        }
      });

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
              React.createElement(FieldArray, { name: 'foo', component: TestComponent })
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
      var stub = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      expect(stub.dirty).toBe(false);
    });

    it('should provide pristine getter that is true when pristine', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: ['dog']
          },
          values: {
            foo: ['dog']
          }
        }
      });

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
              React.createElement(FieldArray, { name: 'foo', component: TestComponent })
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
      var stub = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      expect(stub.pristine).toBe(true);
    });

    it('should provide pristine getter that is false when dirty', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: ['dog']
          },
          values: {
            foo: ['cat']
          }
        }
      });

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
              React.createElement(FieldArray, { name: 'foo', component: TestComponent })
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
      var stub = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      expect(stub.pristine).toBe(false);
    });

    it('should provide sync error for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: [{
              library: 'redux-form',
              author: 'erikras'
            }]
          }
        }
      });
      var validate = function validate() {
        return {
          foo: [{
            _error: 'Too awesome!'
          }]
        };
      };
      var renderArray = function renderArray(_ref) {
        var fields = _ref.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name, index) {
            return React.createElement(
              'div',
              { key: index },
              React.createElement(Field, { name: name + '.library', component: 'input' }),
              React.createElement(Field, { name: name + '.author', component: 'input' }),
              React.createElement(Field, { name: name, component: function component(props) {
                  return React.createElement(
                    'strong',
                    null,
                    props.meta.error
                  );
                } })
            );
          })
        );
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
              React.createElement(FieldArray, { name: 'foo', component: renderArray })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        validate: validate
      })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var error = TestUtils.findRenderedDOMComponentWithTag(dom, 'strong');
      domExpect(error).toExist().toHaveText('Too awesome!');
    });

    it('should provide sync warning for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: [{
              library: 'redux-form',
              author: 'erikras'
            }]
          }
        }
      });
      var warn = function warn() {
        return {
          foo: [{
            _warning: 'Too awesome!'
          }]
        };
      };
      var renderArray = function renderArray(_ref2) {
        var fields = _ref2.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name, index) {
            return React.createElement(
              'div',
              { key: index },
              React.createElement(Field, { name: name + '.library', component: 'input' }),
              React.createElement(Field, { name: name + '.author', component: 'input' }),
              React.createElement(Field, { name: name, component: function component(props) {
                  return React.createElement(
                    'strong',
                    null,
                    props.meta.warning
                  );
                } })
            );
          })
        );
      };

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
              React.createElement(FieldArray, { name: 'foo', component: renderArray })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        warn: warn
      })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var warning = TestUtils.findRenderedDOMComponentWithTag(dom, 'strong');
      domExpect(warning).toExist().toHaveText('Too awesome!');
    });

    it('should reconnect when name changes', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['a', 'b'],
            bar: ['c']
          }
        }
      });
      var component = createSpy(function () {
        return React.createElement('div', null);
      }).andCallThrough();

      var Form = function (_Component17) {
        _inherits(Form, _Component17);

        function Form() {
          _classCallCheck(this, Form);

          var _this17 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this17.state = { field: 'foo' };
          return _this17;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this18 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(FieldArray, { name: this.state.field, component: component }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this18.setState({ field: 'bar' });
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
      expect(component).toHaveBeenCalled();
      expect(component.calls.length).toBe(1);
      expect(component.calls[0].arguments[0].fields.length).toBe(2);

      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(component.calls.length).toBe(2);
      expect(component.calls[1].arguments[0].fields.length).toBe(1);
    });

    it('should not prefix name in fields map callback when inside FormSection', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: { bar: [{ val: 'dog' }, { val: 'cat' }] }
          }
        }
      });
      var TestArray = function TestArray(_ref3) {
        var fields = _ref3.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name) {
            return React.createElement(Field, { key: name, name: name + '.val',
              component: TestComponent });
          })
        );
      };

      var Form = function (_Component18) {
        _inherits(Form, _Component18);

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
              React.createElement(FieldArray, { name: 'bar', component: TestArray })
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
              'foo.bar': { name: 'foo.bar', type: 'FieldArray', count: 1 },
              'foo.bar[0].val': { name: 'foo.bar[0].val', type: 'Field', count: 1 },
              'foo.bar[1].val': { name: 'foo.bar[1].val', type: 'Field', count: 1 }
            },
            values: {
              foo: { bar: [{ val: 'dog' }, { val: 'cat' }] }
            }
          }
        }
      });

      var components = TestUtils.scryRenderedComponentsWithType(dom, TestComponent);
      expect(components[0].props.input.name).toBe('foo.bar[0].val');
      expect(components[1].props.input.name).toBe('foo.bar[1].val');
    });

    it('should prefix name getter when inside FormSection', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: { bar: [{ val: 'dog' }, { val: 'cat' }] }
          }
        }
      });
      var TestArray = function TestArray(_ref4) {
        var fields = _ref4.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name) {
            return React.createElement(Field, { key: name, name: name + '.val',
              component: TestComponent });
          })
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
              React.createElement(FieldArray, { name: 'bar', component: TestArray })
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
      var stub = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      expect(stub.name).toBe('foo.bar');
    });

    it('should not prefix name in fields map callback when inside multiple FormSection', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: { fighter: { bar: [{ val: 'dog' }, { val: 'cat' }] } }
          }
        }
      });
      var TestArray = function TestArray(_ref5) {
        var fields = _ref5.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name) {
            return React.createElement(Field, { key: name, name: name + '.val',
              component: TestComponent });
          })
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
                React.createElement(FieldArray, { name: 'bar', component: TestArray })
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
              'foo.fighter.bar': { name: 'foo.fighter.bar', type: 'FieldArray', count: 1 },
              'foo.fighter.bar[0].val': { name: 'foo.fighter.bar[0].val', type: 'Field', count: 1 },
              'foo.fighter.bar[1].val': { name: 'foo.fighter.bar[1].val', type: 'Field', count: 1 }
            },
            values: {
              foo: { fighter: { bar: [{ val: 'dog' }, { val: 'cat' }] } }
            }
          }
        }
      });

      var components = TestUtils.scryRenderedComponentsWithType(dom, TestComponent);
      expect(components[0].props.input.name).toBe('foo.fighter.bar[0].val');
      expect(components[1].props.input.name).toBe('foo.fighter.bar[1].val');
    });
    it('should prefix name getter when inside multiple FormSection', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: { fighter: { bar: [{ val: 'dog' }, { val: 'cat' }] } }
          }
        }
      });
      var TestArray = function TestArray(_ref6) {
        var fields = _ref6.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name) {
            return React.createElement(Field, { key: name, name: name + '.val',
              component: TestComponent });
          })
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
              React.createElement(
                FormSection,
                { name: 'fighter' },
                React.createElement(FieldArray, { name: 'bar', component: TestArray })
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
      var stub = TestUtils.findRenderedComponentWithType(dom, FieldArray);
      expect(stub.name).toBe('foo.fighter.bar');
    });

    it('should provide field-level sync error for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['dog', 'cat']
          }
        }
      });
      var renderArray = createSpy(function (_ref7) {
        var fields = _ref7.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name, index) {
            return React.createElement(Field, { name: '' + name, component: 'input', key: index });
          })
        );
      }).andCallThrough();
      var noMoreThanTwo = createSpy(function (value) {
        return value && size(value) > 2 ? 'Too many' : undefined;
      }).andCallThrough();

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
              'div',
              null,
              React.createElement(FieldArray, { name: 'foo', component: renderArray, validate: noMoreThanTwo })
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
        React.createElement(TestForm, null)
      ));

      expect(renderArray).toHaveBeenCalled();
      expect(renderArray.calls.length).toBe(1);
      expect(renderArray.calls[0].arguments[0].meta.valid).toBe(true);
      expect(renderArray.calls[0].arguments[0].meta.error).toNotExist();

      expect(noMoreThanTwo).toHaveBeenCalled();
      expect(noMoreThanTwo.calls.length).toBe(1);
      expect(noMoreThanTwo.calls[0].arguments[0]).toEqualMap(['dog', 'cat']);

      renderArray.calls[0].arguments[0].fields.push('rat');

      // should validate
      expect(noMoreThanTwo.calls.length).toBe(2);
      expect(noMoreThanTwo.calls[1].arguments[0]).toEqualMap(['dog', 'cat', 'rat']);

      // should rerender
      expect(renderArray.calls.length).toBe(2);
      expect(renderArray.calls[1].arguments[0].meta.valid).toBe(false);
      expect(renderArray.calls[1].arguments[0].meta.error).toBe('Too many');
    });

    it('should provide field-level sync error (with multiple validators) for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['dog', 'cat']
          }
        }
      });
      var renderArray = createSpy(function (_ref8) {
        var fields = _ref8.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name, index) {
            return React.createElement(Field, { name: '' + name, component: 'input', key: index });
          })
        );
      }).andCallThrough();
      var atLeastOne = createSpy(function (value) {
        return value && size(value) < 1 ? 'Too few' : undefined;
      }).andCallThrough();
      var noMoreThanTwo = createSpy(function (value) {
        return value && size(value) > 2 ? 'Too many' : undefined;
      }).andCallThrough();

      var Form = function (_Component23) {
        _inherits(Form, _Component23);

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
              React.createElement(FieldArray, { name: 'foo', component: renderArray,
                validate: [atLeastOne, noMoreThanTwo] })
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
        React.createElement(TestForm, null)
      ));

      expect(renderArray).toHaveBeenCalled();
      expect(renderArray.calls.length).toBe(1);
      expect(renderArray.calls[0].arguments[0].meta.valid).toBe(true);
      expect(renderArray.calls[0].arguments[0].meta.error).toNotExist();

      expect(noMoreThanTwo).toHaveBeenCalled();
      expect(noMoreThanTwo.calls.length).toBe(1);
      expect(noMoreThanTwo.calls[0].arguments[0]).toEqualMap(['dog', 'cat']);

      renderArray.calls[0].arguments[0].fields.push('rat');

      // should validate
      expect(noMoreThanTwo.calls.length).toBe(2);
      expect(noMoreThanTwo.calls[1].arguments[0]).toEqualMap(['dog', 'cat', 'rat']);

      // should rerender
      expect(renderArray.calls.length).toBe(2);
      expect(renderArray.calls[1].arguments[0].meta.valid).toBe(false);
      expect(renderArray.calls[1].arguments[0].meta.error).toBe('Too many');
    });

    it('should provide field-level sync warning for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['dog', 'cat']
          }
        }
      });
      var renderArray = createSpy(function (_ref9) {
        var fields = _ref9.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name, index) {
            return React.createElement(Field, { name: '' + name, component: 'input', key: index });
          })
        );
      }).andCallThrough();
      var noMoreThanTwo = createSpy(function (value) {
        return value && size(value) > 2 ? 'Too many' : undefined;
      }).andCallThrough();

      var Form = function (_Component24) {
        _inherits(Form, _Component24);

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
              React.createElement(FieldArray, { name: 'foo', component: renderArray, warn: noMoreThanTwo })
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
        React.createElement(TestForm, null)
      ));

      expect(renderArray).toHaveBeenCalled();
      expect(renderArray.calls.length).toBe(1);
      expect(renderArray.calls[0].arguments[0].meta.valid).toBe(true);
      expect(renderArray.calls[0].arguments[0].meta.warning).toNotExist();

      expect(noMoreThanTwo).toHaveBeenCalled();
      expect(noMoreThanTwo.calls.length).toBe(1);
      expect(noMoreThanTwo.calls[0].arguments[0]).toEqualMap(['dog', 'cat']);

      renderArray.calls[0].arguments[0].fields.push('rat');

      // should validate
      expect(noMoreThanTwo.calls.length).toBe(2);
      expect(noMoreThanTwo.calls[1].arguments[0]).toEqualMap(['dog', 'cat', 'rat']);

      // should rerender
      expect(renderArray.calls.length).toBe(2);
      expect(renderArray.calls[1].arguments[0].meta.valid).toBe(true); // just a warning
      expect(renderArray.calls[1].arguments[0].meta.warning).toBe('Too many');
    });

    it('should provide field-level sync warning (with multiple validators) for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['dog', 'cat']
          }
        }
      });
      var renderArray = createSpy(function (_ref10) {
        var fields = _ref10.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (name, index) {
            return React.createElement(Field, { name: '' + name, component: 'input', key: index });
          })
        );
      }).andCallThrough();
      var atLeastOne = createSpy(function (value) {
        return value && size(value) < 1 ? 'Too few' : undefined;
      }).andCallThrough();
      var noMoreThanTwo = createSpy(function (value) {
        return value && size(value) > 2 ? 'Too many' : undefined;
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
              React.createElement(FieldArray, { name: 'foo', component: renderArray, warn: [atLeastOne, noMoreThanTwo] })
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
        React.createElement(TestForm, null)
      ));

      expect(renderArray).toHaveBeenCalled();
      expect(renderArray.calls.length).toBe(1);
      expect(renderArray.calls[0].arguments[0].meta.valid).toBe(true);
      expect(renderArray.calls[0].arguments[0].meta.warning).toNotExist();

      expect(noMoreThanTwo).toHaveBeenCalled();
      expect(noMoreThanTwo.calls.length).toBe(1);
      expect(noMoreThanTwo.calls[0].arguments[0]).toEqualMap(['dog', 'cat']);

      renderArray.calls[0].arguments[0].fields.push('rat');

      // should validate
      expect(noMoreThanTwo.calls.length).toBe(2);
      expect(noMoreThanTwo.calls[1].arguments[0]).toEqualMap(['dog', 'cat', 'rat']);

      // should rerender
      expect(renderArray.calls.length).toBe(2);
      expect(renderArray.calls[1].arguments[0].meta.valid).toBe(true); // just a warning
      expect(renderArray.calls[1].arguments[0].meta.warning).toBe('Too many');
    });

    it('should reconnect when props change', function () {
      var store = makeStore();
      var component = createSpy(function () {
        return React.createElement('div', null);
      }).andCallThrough();

      var Form = function (_Component26) {
        _inherits(Form, _Component26);

        function Form() {
          _classCallCheck(this, Form);

          var _this27 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this27.state = { foo: 'foo', bar: 'bar' };
          return _this27;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this28 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(FieldArray, { name: 'foo', foo: this.state.foo, bar: this.state.bar, component: component }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this28.setState({ foo: 'qux', bar: 'baz' });
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
      expect(component).toHaveBeenCalled();
      expect(component.calls.length).toBe(1);
      expect(component.calls[0].arguments[0].foo).toBe('foo');
      expect(component.calls[0].arguments[0].bar).toBe('bar');

      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(component.calls.length).toBe(2);
      expect(component.calls[1].arguments[0].foo).toBe('qux');
      expect(component.calls[1].arguments[0].bar).toBe('baz');
    });

    it('should allow addition after focus', function () {
      var store = makeStore();
      var component = createSpy(function () {
        return React.createElement('div', null);
      }).andCallThrough();

      var Form = function (_Component27) {
        _inherits(Form, _Component27);

        function Form() {
          _classCallCheck(this, Form);

          var _this29 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this29.state = { foo: 'foo', bar: 'bar' };
          return _this29;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this30 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(FieldArray, { name: 'foo', foo: this.state.foo, bar: this.state.bar, component: component }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this30.setState({ foo: 'qux', bar: 'baz' });
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
      expect(component).toHaveBeenCalled();
      expect(component.calls.length).toBe(1);
      expect(component.calls[0].arguments[0].foo).toBe('foo');
      expect(component.calls[0].arguments[0].bar).toBe('bar');

      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(component.calls.length).toBe(2);
      expect(component.calls[1].arguments[0].foo).toBe('qux');
      expect(component.calls[1].arguments[0].bar).toBe('baz');
    });

    it('should rerender when items added or removed', function () {
      var store = makeStore({});
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref11) {
        var fields = _ref11.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          }),
          React.createElement(
            'button',
            { className: 'add', onClick: function onClick() {
                return fields.push();
              } },
            'Add Dog'
          ),
          React.createElement(
            'button',
            { className: 'remove', onClick: function onClick() {
                return fields.pop();
              } },
            'Remove Dog'
          )
        );
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
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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
      var addButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'add');
      var removeButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'remove');

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);

      // add field
      TestUtils.Simulate.click(addButton);

      // field array rerendered, length is 1
      expect(renderFieldArray.calls.length).toBe(2);
      expect(renderFieldArray.calls[1].arguments[0].fields.length).toBe(1);

      // add field
      TestUtils.Simulate.click(addButton);

      // field array rerendered, length is 2
      expect(renderFieldArray.calls.length).toBe(3);
      expect(renderFieldArray.calls[2].arguments[0].fields.length).toBe(2);

      // add field
      TestUtils.Simulate.click(addButton);

      // field array rerendered, length is 3
      expect(renderFieldArray.calls.length).toBe(4);
      expect(renderFieldArray.calls[3].arguments[0].fields.length).toBe(3);

      // remove field
      TestUtils.Simulate.click(removeButton);

      // field array rerendered, length is 2
      expect(renderFieldArray.calls.length).toBe(5);
      expect(renderFieldArray.calls[4].arguments[0].fields.length).toBe(2);

      // add field
      TestUtils.Simulate.click(addButton);

      // field array rerendered, length is 3
      expect(renderFieldArray.calls.length).toBe(6);
      expect(renderFieldArray.calls[5].arguments[0].fields.length).toBe(3);
    });

    it('should rerender when array sync error appears or disappears', function () {
      if (allowsArrayErrors) {
        var store = makeStore({
          testForm: {
            values: {
              dogs: []
            }
          }
        });
        var renderFieldArray = createSpy(function (_ref12) {
          var fields = _ref12.fields;
          return React.createElement(
            'div',
            null,
            fields.map(function (field, index) {
              return React.createElement(
                'div',
                { key: index },
                field
              );
            }),
            React.createElement(
              'button',
              { className: 'add', onClick: function onClick() {
                  return fields.push();
                } },
              'Add Dog'
            ),
            React.createElement(
              'button',
              { className: 'remove', onClick: function onClick() {
                  return fields.pop();
                } },
              'Remove Dog'
            )
          );
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
              return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
            }
          }]);

          return Form;
        }(Component);

        var TestForm = reduxForm({
          form: 'testForm',
          validate: function validate(values) {
            var dogs = getIn(values, 'dogs');
            var errors = {
              dogs: []
            };
            if (dogs && size(dogs) === 0) {
              errors.dogs._error = 'No dogs';
            }
            if (dogs && size(dogs) > 1) {
              errors.dogs._error = 'Too many';
            }
            return errors;
          }
        })(Form);
        var dom = TestUtils.renderIntoDocument(React.createElement(
          Provider,
          { store: store },
          React.createElement(TestForm, null)
        ));
        var addButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'add');
        var removeButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'remove');

        // length is 0, ERROR!
        expect(renderFieldArray).toHaveBeenCalled();
        expect(renderFieldArray.calls.length).toBe(2);
        expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);
        expect(renderFieldArray.calls[0].arguments[0].meta.error).toExist().toBe('No dogs');

        renderFieldArray.reset();
        TestUtils.Simulate.click(addButton); // length goes to 1, no error yet

        expect(renderFieldArray).toHaveBeenCalled();
        expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(1);
        expect(renderFieldArray.calls[0].arguments[0].meta.error).toNotExist();

        renderFieldArray.reset();
        TestUtils.Simulate.click(addButton); // length goes to 2, ERROR!

        expect(renderFieldArray).toHaveBeenCalled();
        expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(2);
        expect(renderFieldArray.calls[0].arguments[0].meta.error).toExist().toBe('Too many');

        renderFieldArray.reset();
        TestUtils.Simulate.click(removeButton); // length goes to 1, ERROR disappears!

        expect(renderFieldArray).toHaveBeenCalled();
        expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(1);
        expect(renderFieldArray.calls[0].arguments[0].meta.error).toNotExist();

        renderFieldArray.reset();
        TestUtils.Simulate.click(removeButton); // length goes to 0, ERROR!

        expect(renderFieldArray).toHaveBeenCalled();
        expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);
        expect(renderFieldArray.calls[0].arguments[0].meta.error).toExist().toBe('No dogs');
      }
    });

    it('should rerender when array sync warning appears or disappears', function () {
      var store = makeStore({
        testForm: {
          values: {
            dogs: []
          }
        }
      });
      var renderFieldArray = createSpy(function (_ref13) {
        var fields = _ref13.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field, index) {
            return React.createElement(
              'div',
              { key: index },
              field
            );
          }),
          React.createElement(
            'button',
            { className: 'add', onClick: function onClick() {
                return fields.push();
              } },
            'Add Dog'
          ),
          React.createElement(
            'button',
            { className: 'remove', onClick: function onClick() {
                return fields.pop();
              } },
            'Remove Dog'
          )
        );
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
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        form: 'testForm',
        warn: function warn(values) {
          var dogs = getIn(values, 'dogs');
          var warnings = {
            dogs: []
          };
          if (dogs && size(dogs) === 0) {
            warnings.dogs._warning = 'No dogs';
          }
          if (dogs && size(dogs) > 1) {
            warnings.dogs._warning = 'Too many';
          }
          return warnings;
        }
      })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));
      var addButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'add');
      var removeButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'remove');

      // length is 0, ERROR!
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);
      expect(renderFieldArray.calls[0].arguments[0].meta.warning).toExist().toBe('No dogs');

      TestUtils.Simulate.click(addButton); // length goes to 1, no warning yet

      expect(renderFieldArray.calls.length).toBe(2);
      expect(renderFieldArray.calls[1].arguments[0].fields.length).toBe(1);
      expect(renderFieldArray.calls[1].arguments[0].meta.warning).toNotExist();

      TestUtils.Simulate.click(addButton); // length goes to 2, ERROR!

      expect(renderFieldArray.calls.length).toBe(3);
      expect(renderFieldArray.calls[2].arguments[0].fields.length).toBe(2);
      expect(renderFieldArray.calls[2].arguments[0].meta.warning).toExist().toBe('Too many');

      TestUtils.Simulate.click(removeButton); // length goes to 1, ERROR disappears!

      expect(renderFieldArray.calls.length).toBe(4);
      expect(renderFieldArray.calls[3].arguments[0].fields.length).toBe(1);
      expect(renderFieldArray.calls[3].arguments[0].meta.warning).toNotExist();

      TestUtils.Simulate.click(removeButton); // length goes to 0, ERROR!

      expect(renderFieldArray.calls.length).toBe(5);
      expect(renderFieldArray.calls[4].arguments[0].fields.length).toBe(0);
      expect(renderFieldArray.calls[4].arguments[0].meta.warning).toExist().toBe('No dogs');
    });

    it('should rerender when depending value has updated', function () {
      var store = makeStore({
        testForm: {
          values: {
            dogs: [{
              name: 'Fido',
              hasCollar: false
            }, {
              name: 'Snoopy',
              hasCollar: false
            }]
          }
        }
      });
      var renderFieldArray = createSpy(function (_ref14) {
        var fields = _ref14.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field, index) {
            return React.createElement(
              'div',
              { key: index },
              getIn(fields.get(index), 'hasCollar') && React.createElement('span', { className: 'collar' }),
              React.createElement(Field, { name: field + '.hasCollar', component: 'input', type: 'checkbox' }),
              React.createElement(Field, { name: field + '.name', component: 'input' })
            );
          }),
          React.createElement(
            'button',
            { className: 'add', onClick: function onClick() {
                return fields.push();
              } },
            'Add Dog'
          ),
          React.createElement(
            'button',
            { className: 'remove', onClick: function onClick() {
                return fields.pop();
              } },
            'Remove Dog'
          )
        );
      }).andCallThrough();

      var Form = function (_Component31) {
        _inherits(Form, _Component31);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({
        pure: false,
        form: 'testForm'
      })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      var checkbox = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'input').find(function (element) {
        return element.getAttribute('name') === 'dogs[0].hasCollar';
      });

      TestUtils.Simulate.change(checkbox, { target: { value: true } });

      expect(TestUtils.scryRenderedDOMComponentsWithClass(dom, 'collar').length).toBe(1);

      TestUtils.Simulate.change(checkbox, { target: { value: false } });

      expect(TestUtils.scryRenderedDOMComponentsWithClass(dom, 'collar').length).toBe(0);
    });

    it('should NOT rerender when a value changes', function () {
      var store = makeStore({
        testForm: {
          values: {
            dogs: ['Fido', 'Snoopy']
          }
        }
      });
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref15) {
        var fields = _ref15.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          })
        );
      }).andCallThrough();

      var Form = function (_Component32) {
        _inherits(Form, _Component32);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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

      // field array rendered
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);

      // both fields rendered
      expect(renderField).toHaveBeenCalled();
      expect(renderField.calls.length).toBe(2);
      expect(renderField.calls[0].arguments[0].input.value).toBe('Fido');

      // change first field
      renderField.calls[0].arguments[0].input.onChange('Odie');

      // first field rerendered, second field is NOT
      expect(renderField.calls.length).toBe(3);
      expect(renderField.calls[2].arguments[0].input.name).toBe('dogs[0]');
      expect(renderField.calls[2].arguments[0].input.value).toBe('Odie');

      // field array NOT rerendered
      expect(renderFieldArray.calls.length).toBe(1);
    });

    it('should create a list in the store on push(undefined)', function () {
      var store = makeStore({});
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref16) {
        var fields = _ref16.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          }),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return fields.push();
              } },
            'Add Dog'
          )
        );
      }).andCallThrough();

      var Form = function (_Component33) {
        _inherits(Form, _Component33);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 }
            }
          }
        }
      });

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);

      // add field
      TestUtils.Simulate.click(button);

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2);
      expect(renderFieldArray.calls[1].arguments[0].fields.length).toBe(1);

      // field rendered
      expect(renderField).toHaveBeenCalled();
      expect(renderField.calls.length).toBe(1);
      expect(renderField.calls[0].arguments[0].input.name).toBe('dogs[0]');
      expect(renderField.calls[0].arguments[0].input.value).toBe('');

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [undefined]
            },
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 },
              'dogs[0]': { name: 'dogs[0]', type: 'Field', count: 1 }
            }
          }
        }
      });

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList();
    });

    it('should create a list in the store on push(value)', function () {
      var store = makeStore({});
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref17) {
        var fields = _ref17.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          }),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return fields.push('Fido');
              } },
            'Add Dog'
          )
        );
      }).andCallThrough();

      var Form = function (_Component34) {
        _inherits(Form, _Component34);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 }
            }
          }
        }
      });

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);

      // add field
      TestUtils.Simulate.click(button);

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2);
      expect(renderFieldArray.calls[1].arguments[0].fields.length).toBe(1);

      // field rendered
      expect(renderField).toHaveBeenCalled();
      expect(renderField.calls.length).toBe(1);
      expect(renderField.calls[0].arguments[0].input.name).toBe('dogs[0]');
      expect(renderField.calls[0].arguments[0].input.value).toBe('Fido');

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: ['Fido']
            },
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 },
              'dogs[0]': { name: 'dogs[0]', type: 'Field', count: 1 }
            }
          }
        }
      });

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList();
    });

    it('should create a list in the store on unshift(undefined)', function () {
      var store = makeStore({});
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref18) {
        var fields = _ref18.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          }),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return fields.unshift();
              } },
            'Add Dog'
          )
        );
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
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 }
            }
          }
        }
      });

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);

      // add field
      TestUtils.Simulate.click(button);

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2);
      expect(renderFieldArray.calls[1].arguments[0].fields.length).toBe(1);

      // field rendered
      expect(renderField).toHaveBeenCalled();
      expect(renderField.calls.length).toBe(1);
      expect(renderField.calls[0].arguments[0].input.name).toBe('dogs[0]');
      expect(renderField.calls[0].arguments[0].input.value).toBe('');

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [undefined]
            },
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 },
              'dogs[0]': { name: 'dogs[0]', type: 'Field', count: 1 }
            }
          }
        }
      });

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList();
    });

    it('should create a list in the store on unshift(value)', function () {
      var store = makeStore({});
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref19) {
        var fields = _ref19.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          }),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return fields.unshift('Fido');
              } },
            'Add Dog'
          )
        );
      }).andCallThrough();

      var Form = function (_Component36) {
        _inherits(Form, _Component36);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 }
            }
          }
        }
      });

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);

      // add field
      TestUtils.Simulate.click(button);

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2);
      expect(renderFieldArray.calls[1].arguments[0].fields.length).toBe(1);

      // field rendered
      expect(renderField).toHaveBeenCalled();
      expect(renderField.calls.length).toBe(1);
      expect(renderField.calls[0].arguments[0].input.name).toBe('dogs[0]');
      expect(renderField.calls[0].arguments[0].input.value).toBe('Fido');

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: ['Fido']
            },
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 },
              'dogs[0]': { name: 'dogs[0]', type: 'Field', count: 1 }
            }
          }
        }
      });

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList();
    });

    it('should create a list in the store on insert(undefined)', function () {
      var store = makeStore({});
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref20) {
        var fields = _ref20.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          }),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return fields.insert(0);
              } },
            'Add Dog'
          )
        );
      }).andCallThrough();

      var Form = function (_Component37) {
        _inherits(Form, _Component37);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 }
            }
          }
        }
      });

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);

      // add field
      TestUtils.Simulate.click(button);

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2);
      expect(renderFieldArray.calls[1].arguments[0].fields.length).toBe(1);

      // field rendered
      expect(renderField).toHaveBeenCalled();
      expect(renderField.calls.length).toBe(1);
      expect(renderField.calls[0].arguments[0].input.name).toBe('dogs[0]');
      expect(renderField.calls[0].arguments[0].input.value).toBe('');

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [undefined]
            },
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 },
              'dogs[0]': { name: 'dogs[0]', type: 'Field', count: 1 }
            }
          }
        }
      });

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList();
    });

    it('should create a list in the store on insert(value)', function () {
      var store = makeStore({});
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref21) {
        var fields = _ref21.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          }),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return fields.insert(0, 'Fido');
              } },
            'Add Dog'
          )
        );
      }).andCallThrough();

      var Form = function (_Component38) {
        _inherits(Form, _Component38);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 }
            }
          }
        }
      });

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(0);

      // add field
      TestUtils.Simulate.click(button);

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2);
      expect(renderFieldArray.calls[1].arguments[0].fields.length).toBe(1);

      // field rendered
      expect(renderField).toHaveBeenCalled();
      expect(renderField.calls.length).toBe(1);
      expect(renderField.calls[0].arguments[0].input.name).toBe('dogs[0]');
      expect(renderField.calls[0].arguments[0].input.value).toBe('Fido');

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: ['Fido']
            },
            registeredFields: {
              dogs: { name: 'dogs', type: 'FieldArray', count: 1 },
              'dogs[0]': { name: 'dogs[0]', type: 'Field', count: 1 }
            }
          }
        }
      });

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList();
    });

    it('should work with Fields', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['firstValue', 'secondValue']
          }
        }
      });
      var renderField = createSpy(function (field) {
        return React.createElement('input', field.input);
      });

      var renderFields = createSpy(function (_ref22) {
        var foo = _ref22.foo;
        return React.createElement(
          'div',
          null,
          foo.map(renderField)
        );
      }).andCallThrough();

      var component = createSpy(function (_ref23) {
        var fields = _ref23.fields;
        return React.createElement(
          'div',
          null,
          React.createElement(Fields, { names: fields, component: renderFields })
        );
      }).andCallThrough();

      var Form = function (_Component39) {
        _inherits(Form, _Component39);

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
              React.createElement(FieldArray, { name: 'foo', component: component })
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
      expect(renderFields.calls.length).toBe(1);
      expect(renderFields.calls[0].arguments[0].foo.length).toBe(2);

      expect(renderField).toHaveBeenCalled();
      expect(renderField.calls.length).toBe(2);
      expect(renderField.calls[0].arguments[0].input.value).toBe('firstValue');
      expect(renderField.calls[1].arguments[0].input.value).toBe('secondValue');
    });

    it('should get() actual current value from redux store', function () {
      var store = makeStore({
        testForm: {
          values: {
            dogs: ['Fido', 'Snoopy']
          }
        }
      });
      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref24) {
        var fields = _ref24.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          })
        );
      }).andCallThrough();

      var Form = function (_Component40) {
        _inherits(Form, _Component40);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(FieldArray, { name: 'dogs', component: renderFieldArray });
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

      // field array rendered
      expect(renderFieldArray).toHaveBeenCalled();
      expect(renderFieldArray.calls.length).toBe(1);

      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(2);
      expect(renderFieldArray.calls[0].arguments[0].fields.get(0)).toBe('Fido');

      // change first field
      renderField.calls[0].arguments[0].input.onChange('Odie');

      // field array NOT rerendered
      expect(renderFieldArray.calls.length).toBe(1);
      expect(renderFieldArray.calls[0].arguments[0].fields.length).toBe(2);

      // but get() should get the new value
      expect(renderFieldArray.calls[0].arguments[0].fields.get(0)).toBe('Odie');
    });
  });
};

describeFieldArray('FieldArray.plain', plain, plainCombineReducers, addExpectations(plainExpectations));
describeFieldArray('FieldArray.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations));