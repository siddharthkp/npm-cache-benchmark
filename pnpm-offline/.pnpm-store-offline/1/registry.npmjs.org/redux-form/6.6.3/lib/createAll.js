'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _reduxForm = require('./reduxForm');

var _reduxForm2 = _interopRequireDefault(_reduxForm);

var _Field = require('./Field');

var _Field2 = _interopRequireDefault(_Field);

var _Fields = require('./Fields');

var _Fields2 = _interopRequireDefault(_Fields);

var _FieldArray = require('./FieldArray');

var _FieldArray2 = _interopRequireDefault(_FieldArray);

var _formValueSelector = require('./formValueSelector');

var _formValueSelector2 = _interopRequireDefault(_formValueSelector);

var _values = require('./values');

var _values2 = _interopRequireDefault(_values);

var _getFormNames = require('./selectors/getFormNames');

var _getFormNames2 = _interopRequireDefault(_getFormNames);

var _getFormValues = require('./selectors/getFormValues');

var _getFormValues2 = _interopRequireDefault(_getFormValues);

var _getFormInitialValues = require('./selectors/getFormInitialValues');

var _getFormInitialValues2 = _interopRequireDefault(_getFormInitialValues);

var _getFormSyncErrors = require('./selectors/getFormSyncErrors');

var _getFormSyncErrors2 = _interopRequireDefault(_getFormSyncErrors);

var _getFormAsyncErrors = require('./selectors/getFormAsyncErrors');

var _getFormAsyncErrors2 = _interopRequireDefault(_getFormAsyncErrors);

var _getFormSyncWarnings = require('./selectors/getFormSyncWarnings');

var _getFormSyncWarnings2 = _interopRequireDefault(_getFormSyncWarnings);

var _getFormSubmitErrors = require('./selectors/getFormSubmitErrors');

var _getFormSubmitErrors2 = _interopRequireDefault(_getFormSubmitErrors);

var _isDirty = require('./selectors/isDirty');

var _isDirty2 = _interopRequireDefault(_isDirty);

var _isInvalid = require('./selectors/isInvalid');

var _isInvalid2 = _interopRequireDefault(_isInvalid);

var _isPristine = require('./selectors/isPristine');

var _isPristine2 = _interopRequireDefault(_isPristine);

var _isValid = require('./selectors/isValid');

var _isValid2 = _interopRequireDefault(_isValid);

var _isSubmitting = require('./selectors/isSubmitting');

var _isSubmitting2 = _interopRequireDefault(_isSubmitting);

var _hasSubmitSucceeded = require('./selectors/hasSubmitSucceeded');

var _hasSubmitSucceeded2 = _interopRequireDefault(_hasSubmitSucceeded);

var _hasSubmitFailed = require('./selectors/hasSubmitFailed');

var _hasSubmitFailed2 = _interopRequireDefault(_hasSubmitFailed);

var _Form = require('./Form');

var _Form2 = _interopRequireDefault(_Form);

var _FormSection = require('./FormSection');

var _FormSection2 = _interopRequireDefault(_FormSection);

var _SubmissionError = require('./SubmissionError');

var _SubmissionError2 = _interopRequireDefault(_SubmissionError);

var _propTypes = require('./propTypes');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _actionTypes = require('./actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAll = function createAll(structure) {
  return _extends({
    // separate out field actions
    actionTypes: actionTypes
  }, actions, {
    Field: (0, _Field2.default)(structure),
    Fields: (0, _Fields2.default)(structure),
    FieldArray: (0, _FieldArray2.default)(structure),
    Form: _Form2.default,
    FormSection: _FormSection2.default,
    formValueSelector: (0, _formValueSelector2.default)(structure),
    getFormNames: (0, _getFormNames2.default)(structure),
    getFormValues: (0, _getFormValues2.default)(structure),
    getFormInitialValues: (0, _getFormInitialValues2.default)(structure),
    getFormSyncErrors: (0, _getFormSyncErrors2.default)(structure),
    getFormAsyncErrors: (0, _getFormAsyncErrors2.default)(structure),
    getFormSyncWarnings: (0, _getFormSyncWarnings2.default)(structure),
    getFormSubmitErrors: (0, _getFormSubmitErrors2.default)(structure),
    isDirty: (0, _isDirty2.default)(structure),
    isInvalid: (0, _isInvalid2.default)(structure),
    isPristine: (0, _isPristine2.default)(structure),
    isValid: (0, _isValid2.default)(structure),
    isSubmitting: (0, _isSubmitting2.default)(structure),
    hasSubmitSucceeded: (0, _hasSubmitSucceeded2.default)(structure),
    hasSubmitFailed: (0, _hasSubmitFailed2.default)(structure),
    propTypes: _propTypes2.default,
    reduxForm: (0, _reduxForm2.default)(structure),
    reducer: (0, _reducer2.default)(structure),
    SubmissionError: _SubmissionError2.default,
    values: (0, _values2.default)(structure)
  });
};

exports.default = createAll;