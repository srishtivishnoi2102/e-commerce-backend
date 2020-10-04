const Joi = require("joi");


const newCustomer = Joi.object({

    email : Joi.string().email().required(),
    name : Joi.string().required(),
    mobileNumber :Joi.string().length(10).pattern(/^[789]\d{9}$/).required(),
    password : Joi.required(),
    address : Joi.string().optional(),
    creditCardNumber : Joi.string().length(12).optional(),
});

const loginCustomer = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required(),

});

const creditCardNumberCustomer = Joi.object({
    creditCardNumber: Joi.number().required(),
});

const addressCustomer = Joi.object({
    address: Joi.string().required(),
});


module.exports = {
    newCustomer,
    loginCustomer,
    creditCardNumberCustomer,
    addressCustomer,
};

