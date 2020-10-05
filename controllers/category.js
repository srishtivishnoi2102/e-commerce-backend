const { default: to } = require("await-to-js");
const { dbError, sendResponse, invalidPayloadError } = require("../lib/utils/error_handler");
const { isNormalInteger } = require("../lib/utils/helper");


const categoryValidator = require('../lib/PayloadValidation/category');
const categoryModel = require('../lib/datacentre/models/category');
const ProductModel = require('../lib/datacentre/models/product');

const addCategory = async(req, res) =>{
    let err, result;
    [err, result] = await to (categoryValidator.newCategory.validateAsync(req.body));
    if(err){
        return invalidPayloadError(res, err);
    }

    [err, result ] = await to(categoryModel.create(req.body));

    if(err){
        return dbError(res, err);
    }

    return sendResponse(res, result);


}

const getCategories = async(req, res) => {
    let err, result;

    [err, result ]= await to(categoryModel.findAll());

    if(err){
        return dbError(res, err);
    }
    
    return sendResponse(res, result);

}

const getCategoryById = async(req, res) => {
    let id;
    id =  req.params.category_id;
   

    if(!isNormalInteger(id)){
        return res.json({
            success : false,
            message : "Invalid category id",
            data : null,
        });
    }
    let err, result;

    [err, result ]= await to(categoryModel.findByPk(id));
    
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
    let id;
    id =  req.params.product_id;
    
    if(!isNormalInteger(id)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    
    let err, result;

    [err, result ]= await to(ProductModel.findByPk(id));

    if(err){
        return dbError(res, err);
    }
    if(!result){
        return  res.json({
            success : false, 
            message : "NO product exists with product id "+id,
            data : null,
        });
    }
    req.params.category_id = result.dataValues.categoryId.toString();
    return getCategoryById(req, res);
}


module.exports ={
    addCategory,
    getCategories,
    getCategoryById,
    getCategoriesOfProduct,
}

//router.get('/inProduct/:product_id',checkToken, categoryController.getCategoriesOfProduct );