const { default: to } = require("await-to-js");

const ReviewValidator = require("../lib/PayloadValidation/review");

const { invalidPayloadError, dbError, sendResponse } = require("../lib/utils/error_handler");
const { isNormalInteger } = require("../lib/utils/helper");

const ReviewService = require("../services/review");


const postReview = async(req, res) => {

    let reviewObj = req.body;
    reviewObj.productId = req.params.product_id;
    reviewObj.customerId = req.customer.id;

    [err, result ] = await to(ReviewValidator.newReview.validateAsync(reviewObj));
    if(err){
        return invalidPayloadError(res, err);
    }

    // check if customer has purchased the product or not

    [err, result ] = await to (ReviewService.checkIfCustomerOrderedProduct(reviewObj.customerId, reviewObj.productId));
    if(err){
        return dbError(res, err);
    }
    if(!result){
        return  res.json({
            success : false,
            message : "Haven't purchased the product"
        });
    }

    //  add review
    [err, result] = await to(ReviewService.addNewReview(reviewObj));

    if(err){
        return dbError(res, err);
    }

    return sendResponse(res, result);

}

const getProductReviews = async(req, res) => {
    const productId = req.params.product_id;

    let err, result;
    if(!isNormalInteger(productId)){
        return res.json({
            success : false,
            pid,
            message : "Invalid product id",
            data : null,
        });
    }

    [err, result] = await to(ReviewService.getProductReviews(productId));

    if(err){
        return dbError(res, err);
    }

    return sendResponse(res, result);


 }
module.exports= {
    getProductReviews,
    postReview,
}