const ProductModel = require("../models/product");
const ProductValidator = require("../lib/PayloadValidation/product");
const { default: to } = require("await-to-js");
const { invalidPayloadError, dbError, sendResponse } = require("../lib/utils/error_handler");
const { isNormalInteger } = require("../lib/utils/helper");

const postProduct = async(req, res) => {
    let err, result;

    [err, result]= await to(ProductValidator.newProduct.validateAsync(req.body));
    if(err){
        return invalidPayloadError(res, err);
    }

    [err, result] = await to(ProductModel.findAndCountAll({
        where : {
            name : req.body.name,
        }
    }));

    if(err){
        return dbError(res, err);
    }

    if (result.count){
        return res.json({
            success : false,
            message : "Product already exists",
        }); 
   }

//    insert into db
   [err, result ] = await to(ProductModel.create(req.body));
   if(err){
       return dbError(res, err);
   }
   sendResponse(res, result);

}

const getAllProducts = async(req, res) => {
    let err, result;

    
    [err, result] = await to(ProductModel.findAndCountAll() );

    if(err){
        return dbError(res, err);
    }

    if (!result.count){
        return res.json({
            success : false,
            message : "No Product exists",
        }); 
   }

   sendResponse(res, result);

}

const getProductById = async(req, res) => {
    let err, result;

    const pid = req.params.product_id;
    [err, result ]= await to(ProductModel.findByPk(pid));
    
    if(err){
        return dbError(res, err);
    }
    if(!result){
        return  res.json({
            success : false, 
            message : "NO product exists with product id "+pid,
            data : null,
        });
    }
    console.log("product with id-"+pid + result);
    return sendResponse(res, result);

}


const getAllProductsWithCategoryId = async(req, res) => {
    let cid;
    
    cid = req.params.category_id;
    if (! isNormalInteger(cid)){
        return res.json({
            success : false,
            message : "Invalid category id",
            data : null,
        });
    }
  
    
    let err, result;

    [err, result ]= await to(ProductModel.findAndCountAll({
        where: {
            categoryId : cid,
        }
    }));
    
    if(err){
        return dbError(res, err);
    }
    if(result.count==0){
        return  res.json({
            success : false, 
            message : "NO product exists with category id "+cid,
            data : null,
        });
    }
    return sendResponse(res, result);
}


module.exports ={
    postProduct,
    getAllProducts,
    getProductById,
    getAllProductsWithCategoryId,
}