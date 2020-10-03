const {  DataTypes} = require("sequelize");

const { db } = require("../mysql");

const Order = require("./order");
const Product = require("./product");


const OrderItem = db.define( "order_item", {
    orderId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Order,
            key : 'id',
        },
        
    },

    productId :{
        type : DataTypes.INTEGER,
        references : {
            model : Product,
            key : 'id',
        }

    },

    quantity : {
        type : DataTypes.INTEGER,
        defaultValue : 1
    },

},
{
    timestamps : false
})


module.exports = OrderItem;