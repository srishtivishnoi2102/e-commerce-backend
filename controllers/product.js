const { default: to } = require("await-to-js");

const ProductModel = require("../lib/datacentre/models/product");
const ProductValidator = require("../lib/PayloadValidation/product");


const { invalidPayloadError, dbError, sendResponse } = require("../lib/utils/error_handler");
const { isNormalInteger } = require("../lib/utils/helper");
const ProductService = require("../services/product");

const postProduct = async(req, res) => {
    let err, result;

    let product = req.body;

    [err, result]= await to(ProductValidator.newProduct.validateAsync(product));
    if(err){
        return invalidPayloadError(res, err);
    }

    [err, result]= await to(ProductService.addNewProduct(product));
    if(err){
        dbError(res,err);
    }


    sendResponse(res, result);

}

const getAllProducts = async(req, res) => {
    let err, result;

    
    [err, result] = await to(ProductService.getAllProducts());

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

    const productId = req.params.product_id;
    if (! isNormalInteger(productId)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    [err, result ]= await to(ProductService.getProductById(productId));
    
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

    return sendResponse(res, result);

}


const getAllProductsWithCategoryId = async(req, res) => {
    
    const categoryId = req.params.category_id;
    if (! isNormalInteger(categoryId)){
        return res.json({
            success : false,
            message : "Invalid category id",
            data : null,
        });
    }
  
    
    let err, result;

    [err, result ]= await to(ProductService.getAllProductsWithCategoryId(categoryId));
    
    if(err){
        return dbError(res, err);
    }
    if(result.count==0){
        return  res.json({
            success : false, 
            message : "NO product exists with category id "+categoryId,
            data : null,
        });
    }
    return sendResponse(res, result);
}

const getProductDetails = async(req, res) => {
    const productId = req.params.product_id;

    let err, result;
    if(!isNormalInteger(productId)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    [err, result ]=  await to(ProductService.getProductDetails(productId));
    if(err){
        return dbError(res, err);
    }
    sendResponse(res, result);



}



module.exports ={
    postProduct,
    getAllProducts,
    getProductById,
    getAllProductsWithCategoryId,
    getProductDetails,
}