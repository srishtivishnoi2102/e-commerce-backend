require('dotenv').config();

const { default: to } = require('await-to-js');
const { Sequelize, Model, DataTypes } = require('sequelize');

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT;

// db_connection_details = 'mysql://root:password:8080/ecom'
const db = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        dialect: DB_DIALECT,
    }
)
const db_connect = async() =>{
    let err, res;
    [err, res ]=  await to(db.sync({
        alter :true,
        // force :true,

    }));

    if(err){
        console.log("Unable to connect to database , err: ",err);
    }else{
        console.log("Successfully connected to database.");
    }
}

module.exports = {db , db_connect};