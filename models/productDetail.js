const { Sequelize , DataTypes} = require("sequelize/types");
const { db } = require("../lib/datacentre/mysql");
const Product = require("./product");


const ProductDetail = db.define( "product_detail", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },

    productId : {
        type : DataTypes.STRING,
        allowNull : false,
        references : {
            model : Product,
            key : 'id',
        },
        
    },

    size : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    color : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    brand : {
        type : DataTypes.STRING,
        allowNull : false,   
    },

})


module.exports = ProductDetail;