const { default: to } = require("await-to-js");
const jwt = require("jsonwebtoken");

const salt = 'c3Jpc2h0aQo';


const checkToken = async(req, res, next) => {
    const bearerToken = req.headers.authorization;
    if(!bearerToken){
        return  res.json({
            success : false,
            message : "Token value required as Authorization under header!",
        });
    }

    const token = bearerToken.split(' ')[1];
    if(!token){
        return  res.json({
            success : false,
            message : "Access token not found",
        });
    }

    jwt.verify(token, salt, (err, customer)=>{
        if(err || !customer.id){
            console.log("Token InValid, ", customer);
            return  res.json({
                        success : false,
                        message : "Invalid token",
                    });
        }else{
            console.log("Token Valid : ", customer);
            req.customer = customer;
            next();
        }
    })    

}

module.exports = checkToken;