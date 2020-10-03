const { default: to } = require("await-to-js");

const ProductModel = require("../lib/datacentre/models/product");
const ReviewModel = require("../lib/datacentre/models/review");
const OrderModel = require("../lib/datacentre/models/order");
const OrderItemModel = require("../lib/datacentre/models/orderItem");

const ReviewValidator = require("../lib/PayloadValidation/review");

const { invalidPayloadError, dbError, sendResponse } = require("../lib/utils/error_handler");
const { isNormalInteger } = require("../lib/utils/helper");


const postReview = async(req, res) => {
    req.body.productId = req.params.product_id;
    const cid = req.customer.id;
    const pid = req.body.productId;

    [err, result ] = await to(ReviewValidator.newReview.validateAsync(req.body));
    if(err){
        return invalidPayloadError(res, err);
    }

    // check if customer has purchased the product or not

    [err, result ] = await to (
        OrderItemModel.count({
            include : [{
                model : OrderModel,
                where : {
                    customerId : cid.toString(),
                }
            }],
            where : {
                productId : pid,
            }
        })
    )
    if(err){
        return dbError(res, err);
    }
    if(result==0){
        return  res.json({
            success : false,
            message : "Haven't purchased the product"
        });
    }

    //  add review
    [err, result] = await to(ReviewModel.create(req.body));

    if(err){
        return dbError(res, err);
    }

    return sendResponse(res, result);

}

const getProductReviews = async(req, res) => {
    const pid = req.params.product_id;

    let err, result;
    if(!isNormalInteger(pid)){
        return res.json({
            success : false,
            pid,
            message : "Invalid product id",
            data : null,
        });
    }

    [err, result] = await to(ReviewModel.findAndCountAll({
        where : {
            productId : pid,
        }
    }) );

    if(err){
        return dbError(res, err);
    }

    return sendResponse(res, result);


 }
module.exports= {
    getProductReviews,
    postReview,
}