const Validator = require('validator');
const isEmpty = require('../generic/is-empty');

module.exports = function validateEducationInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.field_study = !isEmpty(data.field_study) ? data.field_study : '';
    data.date_from = !isEmpty(data.date_from) ? data.date_from : '';

    if (Validator.isEmpty(data.school)) {
        errors.school = 'School is required!';
    }

    if (Validator.isEmpty(data.field_study)) {
        errors.field_study = 'Field Study is required!';
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree is required!';
    }

    if (Validator.isEmpty(data.date_from)) {
        errors.date_from = 'From Date is required!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
