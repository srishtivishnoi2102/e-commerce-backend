const { Sequelize , DataTypes} = require("sequelize/types");
const { db } = require("../lib/datacentre/mysql");


const Category = db.define( "category", {
    id : {
        type : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },


    name : {
        type : DataTypes.STRING,
        allowNull : false,        
    },



})


module.exports = Category;