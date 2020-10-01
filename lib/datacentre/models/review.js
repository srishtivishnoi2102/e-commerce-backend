const { DataTypes} = require("sequelize");

const { db } = require("../mysql");
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

    review : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    rating : {
        type : DataTypes.INTEGER,
        defaultValue : 0,
    },

})


module.exports = Review;