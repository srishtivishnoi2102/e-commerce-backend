const { Sequelize , DataTypes, STRING} = require("sequelize/types");
const { db } = require("../mysql");
const Address = require("./address");
const Customer = require("./customer");


const Order = db.define( "order", {
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

    address :{
        type : DataTypes.STRING,
        

    },

    created : {
        type : DataTypes.DATE,
        allowNull : false,
    },

    modified : {
        type : DataTypes.DATE,
        allowNull : false,
    },

    status : {
        type : DataTypes.STRING,
        allowNull : false
    },

    amount : {
        type : DataTypes.INTEGER,
        allowNull : false
    },

},
{
    timestamps : false
})


module.exports = Order;