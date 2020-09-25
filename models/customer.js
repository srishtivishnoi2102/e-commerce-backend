const { Sequelize , DataTypes} = require("sequelize/types");
const { db } = require("../lib/datacentre/mysql");


const Customer = db.define( "customer", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },

    email : {
        type : DataTypes.STRING,
        unique : true,
        allowNull : false,
        
    },

    name : {
        type : DataTypes.STRING,
        allowNull : false,
        
    },

    dob : {
        type : DataTypes.DATE,
        allowNull : false,
    },

    mobileNumber : {
        type : DataTypes.STRING(10),
        unique : true,
        allowNull : false,
        
    },

    encryptedPassword : {
        type : DataTypes.STRING,
        allowNull : false,        address
    },

})


module.exports = Customer;