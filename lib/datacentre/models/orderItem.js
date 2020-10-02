const { Sequelize , DataTypes, STRING} = require("sequelize/types");
const { db } = require("../mysql");
const Order = require("./order");
const Product = require("./product");
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