var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import createReducer from './reducer';
import createReduxForm from './reduxForm';
import createField from './Field';
import createFields from './Fields';
import createFieldArray from './FieldArray';
import createFormValueSelector from './formValueSelector';
import createValues from './values';
import createGetFormNames from './selectors/getFormNames';
import createGetFormValues from './selectors/getFormValues';
import createGetFormInitialValues from './selectors/getFormInitialValues';
import createGetFormSyncErrors from './selectors/getFormSyncErrors';
import createGetFormAsyncErrors from './selectors/getFormAsyncErrors';
import createGetFormSyncWarnings from './selectors/getFormSyncWarnings';
import createGetFormSubmitErrors from './selectors/getFormSubmitErrors';
import createIsDirty from './selectors/isDirty';
import createIsInvalid from './selectors/isInvalid';
import createIsPristine from './selectors/isPristine';
import createIsValid from './selectors/isValid';
import createIsSubmitting from './selectors/isSubmitting';
import createHasSubmitSucceeded from './selectors/hasSubmitSucceeded';
import createHasSubmitFailed from './selectors/hasSubmitFailed';
import Form from './Form';
import FormSection from './FormSection';
import SubmissionError from './SubmissionError';
import propTypes from './propTypes';
import * as actions from './actions';
import * as actionTypes from './actionTypes';

var createAll = function createAll(structure) {
  return _extends({
    // separate out field actions
    actionTypes: actionTypes
  }, actions, {
    Field: createField(structure),
    Fields: createFields(structure),
    FieldArray: createFieldArray(structure),
    Form: Form,
    FormSection: FormSection,
    formValueSelector: createFormValueSelector(structure),
    getFormNames: createGetFormNames(structure),
    getFormValues: createGetFormValues(structure),
    getFormInitialValues: createGetFormInitialValues(structure),
    getFormSyncErrors: createGetFormSyncErrors(structure),
    getFormAsyncErrors: createGetFormAsyncErrors(structure),
    getFormSyncWarnings: createGetFormSyncWarnings(structure),
    getFormSubmitErrors: createGetFormSubmitErrors(structure),
    isDirty: createIsDirty(structure),
    isInvalid: createIsInvalid(structure),
    isPristine: createIsPristine(structure),
    isValid: createIsValid(structure),
    isSubmitting: createIsSubmitting(structure),
    hasSubmitSucceeded: createHasSubmitSucceeded(structure),
    hasSubmitFailed: createHasSubmitFailed(structure),
    propTypes: propTypes,
    reduxForm: createReduxForm(structure),
    reducer: createReducer(structure),
    SubmissionError: SubmissionError,
    values: createValues(structure)
  });
};

export default createAll;