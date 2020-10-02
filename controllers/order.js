const { default: to } = require("await-to-js");

const orderModel = require('../lib/datacentre/models/order');
const orderItemModel = require('../lib/datacentre/models/orderItem');
const productModel = require('../lib/datacentre/models/product');
const cartModel = require("../lib/datacentre/models/cart");

const cartController = require('./cart');

const { sendResponse, dbError } = require("../lib/utils/error_handler");
const { isNormalInteger } = require("../lib/utils/helper");


const orderNowProduct = async(req, res) => {
    const cid = req.customer.id;
    const pid = req.params.product_id;
    if (! isNormalInteger(pid)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    let err, result;
    [err, result] = await to(
        productModel.findByPk(pid,{
            attributes : ['price']
        })
    );
    if(err){
        return dbError(res, err);
    }
    const productPrice = result.dataValues.price;

    [err, result] = await to(
        orderModel.create({
            customerId: cid,
            amount : productPrice,
        })
    );

    if(err){
        return dbError(res, err);
    }
    const orderId = result.dataValues.id;

    [err, result] = await to(
        orderItemModel.create({
            orderId: orderId,
            productId: pid,
            quantity : 1,
        })
    );

    if(err){
        return dbError(res, err);
    }

    
    return sendResponse(res, result);

}

const getAllOrdersOfCustomer = async(req, res) => {
    const cid = req.customer.id;
    let err, result;

    [err, result] = await to(
        orderModel.findAndCountAll({
            attributes :{
                exclude : ['id', 'customerId']
            },
            where : {
                customerId : cid,
            }
        })
    )
    if(err){
        return dbError(res, err);
    }
    return sendResponse(res, result);

}

const getOrderDetails = async(req, res) => {
    const cid = req.customer.id;
    const oid = req.params.order_id;
    if (! isNormalInteger(oid)){
        return res.json({
            success : false,
            message : "Invalid order id",
            data : null,
        });
    }

    let err, result;
    [err, result]= await to(
        orderModel.findByPk(oid)
    );

    if(err){
        return dbError(res, err);
    }
    if(!result){
        return  res.json({
            success : false,
            message : "No order exists with order id : "+oid,
            data : null,
        });
    }

   
    if(result.dataValues.customerId != cid){
        return  res.json({
            success : false,
            message : "Not authorised for this order",
            data : null
        });
    }
    delete result.dataValues.id;
    delete result.dataValues.customerId;
    let orderResponse = result;
    [err, result ]= await to(
        orderItemModel.findAndCountAll({
            attributes : ['productId', 'quantity'],
            where : {
                orderId : oid,
            }
        })
    );
    orderResponse.dataValues.orderItems =result;
    console.log(orderResponse);

    return sendResponse(res, orderResponse);




}

const placeOrderFromCart = async(req, res) => {
    console.log("cart order");
    const cid = req.customer.id;
    let err, result;

    [err, result] = await to(cartController.getCartProductService(req,res));
    console.log("result-->> ",result);
    // sendResponse(res, result);
    
    const orderAmount = result.totalCartAmount;
    const cartItems = result.cartItems;
    [err, result] = await to(
        orderModel.create({
            customerId: cid,
            amount : orderAmount,
        })
    );

    if(err){
        return dbError(res, err);
    }
    const orderId = result.dataValues.id;
    let orderItemsArray = []
    cartItems.forEach(cart => {
        orderItemsArray.push({
            orderId,
            quantity :cart.dataValues.quantity,
            productId : cart.dataValues.product.id,

        });
    });

    //  remove all items from from cart

    [err, result] = await to( 
        cartModel.destroy({
            where : {
                customerId: cid
            }
        })
    )
    if(err){
        return dbError(res, err);
    }
    //  insert into order item table
    [err, result] = await to( 
        orderItemModel.bulkCreate(orderItemsArray)
    )
    if(err){
        return dbError(res, err);
    }


    return sendResponse(res, result);


}


module.exports ={
    orderNowProduct,
    getAllOrdersOfCustomer,
    getOrderDetails,
    placeOrderFromCart,
}