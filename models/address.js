const { Sequelize , DataTypes} = require("sequelize/types");
const { db } = require("../lib/datacentre/mysql");
const Customer = require("./customer");


const Address = db.define( "address", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },

    customerId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Customer,
            key : 'id'
        }
        
    },

    fullName : {
        type : DataTypes.STRING,
        allowNull : false,
        
    },

    mobileNumber : {
        type : DataTypes.STRING(10),
        unique : true,
        allowNull : false,
        
    },

    address1 : {
        type : DataTypes.STRING,
        allowNull : false,        
    },

    address2 : {
        type : DataTypes.STRING,
        allowNull : false,        
    },

    city : {
        type : DataTypes.STRING,
        allowNull : false,        
    },



})


module.exports = Address;