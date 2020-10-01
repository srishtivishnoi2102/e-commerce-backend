const { Sequelize , DataTypes} = require("sequelize");
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
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Category,
            key : Category.id,
        },
        
    },

    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    description : {
        type : DataTypes.STRING,
        defaultValue : null,
    },

    price : {
        type : DataTypes.INTEGER,
        allowNull : false,   
    },

})


module.exports = Product;