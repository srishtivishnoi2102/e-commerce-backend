const { default: to } = require("await-to-js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { dbError, sendResponse, invalidPayloadError } = require("../lib/utils/error_handler");

const customerValidator = require('../lib/PayloadValidation/customer');
const customerModel = require('../lib/datacentre/models/customer');
const CustomerService = require("../services/customer");



const registerCustomer = async(req, res) => {
    let err, result;
    
    [err, result] = await to (customerValidator.newCustomer.validateAsync(req.body));
    if(err){
       return invalidPayloadError(res, err);
    }

    // check if email already registered
    [err, result] = await to(CustomerService.checkIfEmailRegistered(req.body.email));

    if(err){
        return dbError(res, err);
    }


    if (result[0]){
        return res.json({
            success : false,
            message : "Email already registered"
        });
   }

    // check if mobileNumber already registered
    [err, result] = await to(CustomerService.checkIfMobileRegistered(req.body.mobileNumber));

    if(err){
        return dbError(res, err);
    }

    if (result){
         return res.json({
             success : false,
             message : "Mobile Number already registered"
         });
         
    }


    [err, result] =  await to(CustomerService.signUpCustomer(req.body));

    if(err){
        return dbError(res, err);
    }
    
    
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
    [err, result] = await to(
        CustomerService.checkIfEmailRegistered(req.body.email)
    );

    if(err){
        return dbError(res, err);
    }

    if (!result[0]){
        return res.json({
            success : false,
            message : "Email not registered, please register first."
        });
   }
   let customer = result[1];
   const enteredPassword = req.body.password;

   [err, result] = await to(CustomerService.signInAndGenerateToken(customer , enteredPassword));
   console.log(err, result);
   if(err){
       return  res.json({
           success : false,
           message : err.message
       });
   }
   if(result.err){
    return  res.json({
        success : false,
        message : result.err.message
    });
   }
   return res.json({
       success : true,
       token : result.token
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
    const cid =parseInt(req.customer.id);
    [err, result] = await to(CustomerService.getCustomerById(cid));

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

    [err, result] = await to(CustomerService.updateCreditCard(req.customer.id, creditCardNumber));
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

    [err, result] = await to(CustomerService.updateAddress(req.customer.id, address));

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