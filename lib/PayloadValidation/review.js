const Joi = require("joi");


const newReview = Joi.object({

    productId : Joi.number().required(),
    customerId :Joi.number().required(),
    review : Joi.string().required(),
    rating : Joi.number().required(),
});


module.exports ={
    newReview
}