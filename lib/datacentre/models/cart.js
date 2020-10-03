const { DataTypes} = require("sequelize");

const { db } = require("../mysql");

const Customer = require("./customer");
const Product = require("./product");


const Cart = db.define( "cart", {

    customerId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Customer,
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
        defaultValue : 1,
    },

},
{
    timestamps : false
})


module.exports = Cart;