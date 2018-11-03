const Validator = require('validator');
const isEmpty = require('../generic/is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.date_from = !isEmpty(data.date_from) ? data.date_from : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Title is required!';
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = 'Company is required!';
    }

    if (Validator.isEmpty(data.date_from)) {
        errors.date_from = 'From Date is required!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
