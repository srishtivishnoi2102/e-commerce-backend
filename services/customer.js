const { default: to } = require("await-to-js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customerModel = require('../lib/datacentre/models/customer');

const salt = process.env.SALT;
const saltRounds =parseInt( process.env.SALT_ROUNDS);

const generateJWToken = (customer) =>{
    
    const token = jwt.sign(customer, salt, {
        expiresIn : 24*60*60,
    });

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

class CustomerService{

    static checkIfEmailRegistered = async(email) => {
        let err, result;
        // it check if email already registered
        [err, result] = await to(customerModel.findOne({
            where : {
                email : email,
            }
        }) );
    
        if(err){
            console.log("Error while checking if email is registered or not");
            return err;
        }
    

        if(result){
            return [true, result.dataValues];
        }
        return [false];
    
    };

    static checkIfMobileRegistered = async(mobileNumber) => {
        let err, result;
        // it check if mobileNumber already registered
        [err, result] = await to(customerModel.findAndCountAll({
            where : {
                mobileNumber : mobileNumber,
            }
        }) );
    
        if(err){
            console.log("Error while checking if mobileNumber is registered or not");
            return err;
        }
    

        if(result.count){
            return true;
        }
        return false;
    
    };

    static signUpCustomer = async(customer) => {
        let err, result;
        
        // password encrpytion
        const hashPassword  = await to ( encryptPassword(customer.password));
        customer.encryptedPassword = hashPassword[1];
        delete customer.password;
    
        // insert into db
        [err, result] =  await to(customerModel.create(customer));
    
        if(err){
            console.log("Error in customer sign up");
            return err;
        }
        delete result.dataValues.id;
        delete result.dataValues.isLoggedIn;
        delete result.dataValues.encryptedPassword;
        return result;
    
    
    };
    
    static signInAndGenerateToken = async(customer, password) => {

        let err, isValid, result;
        [ err, isValid] = await to( bcrypt.compare(password, customer.encryptedPassword));
        if(err){
            console.log("Error in comparing password");
            return err;

        }
        console.log(isValid);
        if(!isValid){    
            console.log("Incorrect Password");
            return {
                err : {
                    message :"Incorrect Password"
                },
                token: null,
            }
        }
    
        [err, result] = await to (customerModel.update({
            isLoggedIn : true,
        },{
            where : {
                email : customer.email,
            }
        }))
    
        if(err){
            return  Error("Error in Login");
        }
        delete customer.encryptedPassword;
        delete customer.isLoggedIn;
        const token=generateJWToken(customer);
        return {
            err :null,
            token,
        };
    
       
    
    }
    

    static getCustomerById = async(customer_id) => {
        let err, result;
        [err, result] = await to(customerModel.findByPk(customer_id,{
            attributes : {
                exclude : ['id', 'isLoggedIn' , 'encryptedPassword']
            }
        }));

        if(err){
            console.log("Error in getting customer by id");
            return err;
        }

        return result;
    
    };
    
    static updateCreditCard = async(customer_id, creditCardNumber) => {
        let err, result;
            
        [err, result] = await to(customerModel.update({
            creditCardNumber : creditCardNumber,
        },{
            where:{
                id : customer_id,
            }
        },    
        ));
        if(err){
            console.log("Error in updating credit card details");
            return Error("Error in updating credit card details");
        }

        return  result;       
    
    };


    static updateAddress = async(customer_id, address) => {
        let err, result;
        
        [err, result] = await to(customerModel.update({
            address : address,
        },{
            where:{
                id : customer_id,
            }
        },    
        ));

        if(err){
            console.log("Error in updating address");
            return Error("Error in updating address");
            
        }
        return result;

    };
    


}
module.exports =CustomerService;
