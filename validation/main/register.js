const Validator = require('validator');
const isEmpty = require('../generic/is-empty');

module.exports = function validateRegisterInput(data) {
	let errors = {}

	data.name = !isEmpty(data.name) ? data.name : ''
	data.email = !isEmpty(data.email) ? data.email : ''
	data.password = !isEmpty(data.password) ? data.password : ''
	data.password2 = !isEmpty(data.password2) ? data.password2 : ''

	if(!Validator.isLength(data.name, { min: 2, max: 30})) {
		errors.name = "Name must between 2 and 30 characters";
	}

	if(!Validator.isEmail(data.email)) {
		errors.email = "Email address is not valid";
	}

	if(Validator.isEmpty(data.password)) {
		errors.email = "Password is required";
	}

	if(Validator.isEmpty(data.password2)) {
		errors.email = "Password confirmation is required";
	}

	if(!Validator.isLength(data.password, { min: 6, max: 30})) {
		errors.password = "Password must between 6 and 30 characters";
	}

	if(!Validator.equals(data.password, data.password2)) {
		errors.password2 = "Password confirmation is not match";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}