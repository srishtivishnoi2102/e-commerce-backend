const { default: to } = require("await-to-js");

const ReviewModel = require("../lib/datacentre/models/review");
const OrderModel = require("../lib/datacentre/models/order");
const OrderItemModel = require("../lib/datacentre/models/orderItem");

class ReviewService {
    static getProductReviews = async(productId) => {

        let err, result;
        [err, result] = await to(ReviewModel.findAll({
            where : {
                productId : productId,
            }
        }));
        if(err){
            return err;
        }
        return result;
     };

    static checkIfCustomerOrderedProduct = async(customerId, productId) => {
        let err, result;
        [err, result ] = await to (
            OrderItemModel.count({
                include : [{
                    model : OrderModel,
                    where : {
                        customerId : customerId,
                    }
                }],
                where : {
                    productId : productId,
                }
            })
        )
        if(err){
            return err;
        }

        return (result>0);

     };

    static addNewReview = async(reviewObj) => {
        let err, result;
        //  add review
        [err, result] = await to(ReviewModel.create(reviewObj));

        if(err){
            return err;
        }

        return result;
    };
};

module.exports= ReviewService;