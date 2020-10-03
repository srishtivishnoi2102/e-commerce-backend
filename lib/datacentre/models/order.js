const { Sequelize , DataTypes, STRING} = require("sequelize");
const { db } = require("../mysql");
const Customer = require("./customer");


const Order = db.define( "order", {
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
            key : 'id',
        },
        
    },

    isDelivered : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
        
    },

    amount : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },


},
{
    timestamps : false
})


module.exports = Order;