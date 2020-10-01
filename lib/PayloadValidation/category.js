const Joi = require("joi");


const newCategory = Joi.object({

    name : Joi.string().required(),
    description : Joi.string().optional(),
});


module.exports ={
    newCategory,
}