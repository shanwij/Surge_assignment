const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function loginInputValidate(data){

    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    //check emails
    if(Validator.isEmpty(data.email)){
        errors.email = "Field is required";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Invalid E-Mail";
    }

    //check passwords
    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }

    return{
        errors,
        isValid: isEmpty(errors)
    };
};