const { DataTypes} = require("sequelize");

const { db } = require("../mysql");
const Customer = require("./customer");

const Product = require("./product");



const Review = db.define( "review", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },

    productId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Product,
            key : "id",
        },
        
    },

    customerId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Customer,
            key : "id",
        },
        
    },

    review : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    rating : {
        type : DataTypes.INTEGER,
        defaultValue : 0,
    },

},
{
    timestamps : false
})


module.exports = Review;