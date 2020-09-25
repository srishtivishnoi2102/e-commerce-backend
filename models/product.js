const { Sequelize , DataTypes} = require("sequelize/types");
const { db } = require("../lib/datacentre/mysql");
const Category = require("./category");


const Product = db.define( "product", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },

    categoryId : {
        type : DataTypes.STRING,
        allowNull : false,
        references : {
            model : Category,
            key : 'id',
        },
        
    },

    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    description : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    price : {
        type : DataTypes.INTEGER,
        allowNull : false,   
    },

})


module.exports = Product;