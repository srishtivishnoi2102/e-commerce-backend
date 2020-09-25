const { Sequelize , DataTypes} = require("sequelize/types");
const { db } = require("../lib/datacentre/mysql");
const Customer = require("./customer");
const ProductDetail = require("./productDetail");


const CartItem = db.define( "cart_item", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },

    customerId : {
        type : DataTypes.STRING,
        allowNull : false,
        references : {
            model : Customer,
            key : 'id',
        },
        
    },

    productDetails :{
        type : DataTypes.INTEGER,
        references : {
            model : ProductDetail,
            key : 'id',
        }

    },

    savedForLater : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,

    },

    timeAdded : {
        type : DataTypes.DATE,
        allowNull : false,
    },

    quantity : {
        type : DataTypes.INTEGER,
        defaultValue : 1,
    },

})


module.exports = CartItem;