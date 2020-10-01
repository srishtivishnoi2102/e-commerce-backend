const { default: to } = require('await-to-js');
const { Sequelize, Model, DataTypes } = require('sequelize');


// db_connection_details = 'mysql://root:password:8080/ecom'
const db = new Sequelize(
    'ecom',
    'root',
    'password',
    {
        host: 'localhost',
        dialect: 'mysql',
    }
)
const db_connect = async() =>{
    let err, res;
    [err, res ]=  await to(db.sync({
        alter :true,
        force :true,

    }));

    if(err){
        console.log("Unable to connect to database , err: ",err);
    }else{
        console.log("Successfully connected to database.");
    }
}

module.exports = {db , db_connect};