const { DataTypes} = require("sequelize");

const { db } = require("../mysql");

const Customer = db.define( "customer", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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


    mobileNumber : {
        type : DataTypes.BIGINT(10),
        allowNull : false,
        unique : true,
        
    },

    encryptedPassword : {
        type : DataTypes.STRING,
        allowNull : false,        
    },

    isLoggedIn : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    },

    creditCardNumber : {
        type : DataTypes.BIGINT(16),
        defaultValue : null,
    },
    address : {
        type : DataTypes.STRING(),
        defaultValue : null,
    }
});

module.exports = Customer;