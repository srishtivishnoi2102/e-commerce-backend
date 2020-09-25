const { Sequelize , DataTypes, STRING} = require("sequelize/types");
const { db } = require("../lib/datacentre/mysql");
const Order = require("./order");
const ProductDetail = require("./productDetail");


const OrderItem = db.define( "order_item", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },

    orderId : {
        type : DataTypes.STRING,
        allowNull : false,
        references : {
            model : Order,
            key : 'id',
        },
        
    },

    productDetailsId :{
        type : DataTypes.INTEGER,
        references : {
            model : ProductDetail,
            key : 'id',
        }

    },

    quantity : {
        type : DataTypes.INTEGER,
        defaultValue : 1
    },

})


module.exports = OrderItem;