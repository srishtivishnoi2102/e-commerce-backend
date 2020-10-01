const Joi = require("joi");


const newProduct = Joi.object({

    name : Joi.string().required(),
    description : Joi.string().optional(),
    categoryId : Joi.number().required(),
    price : Joi.number().required(),


});


module.exports ={
    newProduct,
}