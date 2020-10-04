const { default: to } = require("await-to-js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { dbError, sendResponse, invalidPayloadError } = require("../lib/utils/error_handler");

const customerValidator = require('../lib/PayloadValidation/customer');
const customerModel = require('../lib/datacentre/models/customer');


const salt = process.env.SALT;
const saltRounds =parseInt( process.env.SALT_ROUNDS);

const generateJWToken = (customer) =>{
    
    const token = jwt.sign(customer, salt, {
        expiresIn : 24*60*60,
    });
    // console.log("Toekn generated: ", token);

    return token;
}

const encryptPassword = async(password) => {

    const [err,encryptedPassword] = await to(bcrypt.hash(password, saltRounds));

    if(err){
        console.log("Error while generating password hash",{error:err});
        throw Error('Error while generating password hash');
    }
    return encryptedPassword;

}

const registerCustomer = async(req, res) => {
    let err, result;
    
    [err, result] = await to (customerValidator.newCustomer.validateAsync(req.body));
    if(err){
       return invalidPayloadError(res, err);
    }

    // check if email already registered
    [err, result] = await to(customerModel.findAndCountAll({
        where : {
            email : req.body.email,
        }
    }) );

    if(err){
        return dbError(res, err);
    }

    console.log("find all & count  : : ",result.count);

    if (result.count){
        return res.json({
            success : false,
            message : "Email already registered"
        });
   }

    // check if mobileNumber already registered
    [err, result] = await to(customerModel.findAndCountAll({
        where : {
            mobileNumber : req.body.mobileNumber,
        }
    }) );

    if(err){
        return dbError(res, err);
    }

    if (result.count){
         return res.json({
             success : false,
             message : "Mobile Number already registered"
         });
         
    }


    // password encrpytion
    const hashPassword  = await to ( encryptPassword(req.body.password));
    req.body.encryptedPassword = hashPassword[1];
    delete req.body.password;

    // insert into db
    [err, result] =  await to(customerModel.create(req.body));

    if(err){
        return dbError(res, err);
    }
    delete result.dataValues.id;
    delete result.dataValues.isLoggedIn;
    delete result.dataValues.encryptedPassword;
    sendResponse(res, result)


};

const loginCustomer = async(req, res) => {
    let err, result;
    let {email, password}= req.body;
    
    [err, result] = await to (customerValidator.loginCustomer.validateAsync(req.body));
    
    if(err){
        return invalidPayloadError(res, err);
     }

    // check if email already registered or not
    [err, result] = await to(customerModel.findOne({
        where : {
            email : req.body.email,
        }
    }) );

    if(err){
        return dbError(res, err);
    }


    if (!result){
        console.log("Email not registered", email);

        return res.json({
            success : false,
            message : "Email not registered, please register first."
        });
   }

   const id = result.dataValues.id;
   const encryptedPassword= result.dataValues.encryptedPassword;
   console.log("password: ",req.body.password);
   console.log("encryptedPassword: ",encryptedPassword);
    let isValid;
    [ err, isValid] = await to( bcrypt.compare(password, encryptedPassword));
    console.log("Is valid:",isValid);
    if(!isValid){    
        return  res.json({
            success :false,
            msg:"Password is incorrect"

        }); 
    }

    

    let customer={
        id : id,
        email: req.body.email,
        encryptedPassword :encryptedPassword
    };

    [err, result] = await to (customerModel.update({
        isLoggedIn : true,
    },{
        where : {
            email : req.body.email,
        }
    }))

    if(err){
        return  res.json({
            success :false,
            msg:"Error in Login",
            err : err

        }); 
    }

    const token=generateJWToken(customer);
    return  res.json({
        success : true,
        token
    });

   

}


const getCustomerByIdService = async(req) => {
    let err, result;
    const id =parseInt(req.customer.id);

    [err, result] = await to(customerModel.findByPk(id,{
        attributes : {
            exclude : ['id', 'isLoggedIn' , 'encryptedPassword']
        }
    }));

    if(err){
       return err;
    }

    return result;

};
const getCustomerById = async(req, res) => {
    let err, result;
    [err, result] = await to(getCustomerByIdService(req));


    if(err){
        dbError(res, err);
    }
    

    sendResponse(res, result);

};


const updateCreditCard = async(req, res) => {
    let err, result;
    const {creditCardNumber} = req.body;
    [err, result] = await to(customerValidator.creditCardNumberCustomer.validateAsync(req.body));

    if(err){
        return invalidPayloadError(res, err);
     }

    [err, result] = await to(customerModel.update({
        creditCardNumber : creditCardNumber,
    },{
        where:{
            id : req.customer.id,
        }
    },    
    ));

    if(err){
        return dbError(res, err);
    }

    return  res.json({
        data : result,
        success : true,
        message : "Credit Card Number updated successfully",
        error : null,
    });
    

}

const updateAddress = async(req, res) => {
    let err, result;
    const {address} = req.body;
    [err, result] = await to(customerValidator.addressCustomer.validateAsync(req.body));

    if(err){
        return invalidPayloadError(res, err);
     }

    [err, result] = await to(customerModel.update({
        address : address,
    },{
        where:{
            id : req.customer.id,
        }
    },    
    ));

    if(err){
        return dbError(res, err);
    }
    return  res.json({
        data : result,
        success : true,
        message : "Address updated successfully",
        error : null,
    });
    

}

module.exports = {
    registerCustomer,
    loginCustomer,
    updateCreditCard,
    getCustomerById,
    getCustomerByIdService,
    updateAddress,
}