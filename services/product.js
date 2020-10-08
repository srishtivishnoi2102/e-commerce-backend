const { default: to } = require("await-to-js");

const ProductModel = require("../lib/datacentre/models/product");


class ProductService {

    static getCategoryIdOfProduct = async(productId) => {
        
        let err, result;

        [err, result ]= await to(ProductModel.findByPk(productId,{
            attributes : {
                exclude : ['id','name', 'description','price'],
            }
        }));

        if(err){
            return err;
        }
       
        return result;
    };

    static addNewProduct = async(product) => {

        let err, result;
        
        [err, result ] = await to(ProductModel.create(product));
        if(err){
            return err;
        }
        return result;
    };

    static getAllProducts = async() => {
        let err, result;
    
        [err, result] = await to(ProductModel.findAndCountAll({
            attributes : {exclude : ['id'] },
        }
        ));
    
        if(err){
            return err;
        }    
        return result;
    }
    
    static getProductById = async(productId) => {
        let err, result;
    
        [err, result ]= await to(ProductModel.findByPk(productId,{
            attributes : {exclude : ['id'] },
        }));
        
        if(err){
            return err;
        }
        return result;
    }
    
    static getAllProductsWithCategoryId = async(categoryId) => {      
        
        let err, result;
    
        [err, result ]= await to(ProductModel.findAndCountAll({
            attributes : {exclude : ['categoryId'] },
            where: {
                categoryId : categoryId,
            }
        }));
        
        if(err){
            return err;
        }
        return result;
    }
    
    static getProductDetails = async(productId) => {
        return "Procduct Details";       
    }

}

module.exports = ProductService;