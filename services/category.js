const { default: to } = require("await-to-js");

const categoryModel = require('../lib/datacentre/models/category');
const ProductModel = require('../lib/datacentre/models/product');

class CategoryService {
    static addCategory = async(product) =>{
        let err, result;
    
        [err, result ] = await to(categoryModel.create(product));
    
        if(err){
            return err;
        }
    
        return result;  
    }

    static getCategories = async() => {
        let err, result;

        [err, result ]= await to(categoryModel.findAll());

        if(err){
            return err;
        }
        
        return result;

    }

    static getCategoryById = async(categoryId) => {

        let err, result;

        [err, result ]= await to(categoryModel.findByPk(categoryId));
        
        if(err){
            return err;
        }
        return result;

    };    

}

module.exports =CategoryService;



