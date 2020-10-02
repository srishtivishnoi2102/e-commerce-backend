const { Sequelize , DataTypes} = require("sequelize");
const { db } = require("../mysql");


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
    description  :{
        type : DataTypes.STRING,
        allowNull :true,
        defaultValue : "",
    }



},
{
    timestamps : false
})


module.exports = Category;