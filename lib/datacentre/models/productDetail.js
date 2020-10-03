const { DataTypes} = require("sequelize");

const { db } = require("../mysql");

const Product = require("./product");


const ProductDetail = db.define( "product_detail", {
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
            key : 'id',
        },
        
    },

    attribute : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    value : {
        type : DataTypes.STRING,
        allowNull : false,
    }


},
{
    timestamps : false
})


module.exports = ProductDetail;