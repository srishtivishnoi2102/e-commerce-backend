const { default: to } = require("await-to-js");
const { dbError, sendResponse, invalidPayloadError } = require("../lib/utils/error_handler");
const { isNormalInteger } = require("../lib/utils/helper");

const categoryValidator = require('../lib/PayloadValidation/category');
const CategoryService = require("../services/category");
const ProductService = require("../services/product");

const addCategory = async(req, res) =>{
    let err, result;
    [err, result] = await to (categoryValidator.newCategory.validateAsync(req.body));
    if(err){
        return invalidPayloadError(res, err);
    }

    [err, result ] = await to(CategoryService.addCategory(req.body));

    if(err){
        return dbError(res, err);
    }

    return sendResponse(res, result);


}

const getCategories = async(req, res) => {
    let err, result;

    [err, result ]= await to(CategoryService.getCategories());

    if(err){
        return dbError(res, err);
    }
    
    return sendResponse(res, result);

}

const getCategoryById = async(req, res) => {
    let categoryId;
    categoryId =  req.params.category_id;
   

    if(!isNormalInteger(categoryId)){
        return res.json({
            success : false,
            message : "Invalid category id",
            data : null,
        });
    }

    let err, result;

    [err, result ]= await to(CategoryService.getCategoryById(categoryId));
    
    if(err){
        return dbError(res, err);
    }
    if(!result){
        return  res.json({
            success : false, 
            message : "NO category exists with category id "+id,
            data : null,
        });
    }
    
    return sendResponse(res, result);

}

const getCategoriesOfProduct = async(req, res) => {
    let productId;
    productId =  req.params.product_id;
    
    if(!isNormalInteger(productId)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    
    let err, result;

    [err, result ]= await to(ProductService.getCategoryIdOfProduct(productId));


    if(err){
        return dbError(res, err);
    }
    if(!result){
        return  res.json({
            success : false, 
            message : "NO product exists with product id "+productId,
            data : null,
        });
    }
    // const categoryId = result.dataValues.categoryId;
    req.params.category_id = result.dataValues.categoryId.toString();
    return getCategoryById(req, res);
}


module.exports ={
    addCategory,
    getCategories,
    getCategoryById,
    getCategoriesOfProduct,
}
