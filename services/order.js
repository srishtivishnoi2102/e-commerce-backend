const { default: to } = require("await-to-js");

const orderModel = require('../lib/datacentre/models/order');
const orderItemModel = require('../lib/datacentre/models/orderItem');
const productModel = require('../lib/datacentre/models/product');
const cartModel = require("../lib/datacentre/models/cart");
const { getOrderDates } = require("../lib/utils/helper");

const cartController = require('./cart');




class OrderService {
    static createNewOrder = async(customerId, totalAmount) => {
        let err, result;
        const dates = getOrderDates();

        let orderObj = {
            customerId: customerId,
            amount : totalAmount,
            orderDate : dates.orderDate,
            deliveryDate : dates.deliveryDate,
        };

        console.log(orderObj);
        [err, result] = await to(
            orderModel.create(orderObj)
        );

        if(err){
            return err;
        }
        return result;
    }

    static cartOrderHelper = (orderId, items) => {

        let orderItemsArray = [];
        items.forEach(item => {
            orderItemsArray.push({
                orderId,
                quantity :item.dataValues.quantity,
                productId : item.dataValues.product.id,
            }); 
        });
        return orderItemsArray;
    };

    static putItemsInOrder = async(orderItemsArray) => {
        let err, result;

        [err, result] = await to( 
            orderItemModel.bulkCreate(orderItemsArray)
        )
    };


    static getAllOrdersOfCustomer = async(customerId) => {

        let err, result;
        [err, result] = await to(
            orderModel.findAll({
                attributes :{
                    exclude : [ 'customerId']
                },
                include :[{
                    model : orderItemModel,
                    attributes :  ['quantity', 'productId'],
                }],
                where : {
                    customerId : customerId,
                }
            })
        )
        if(err){
            return err;
        }        
        return result;
    };

    static checkIfOrderExists = async(orderId) => {
        let err, result;
        [err, result]= await to(
            orderModel.findByPk(orderId)
        );

        if(err){
            return dbError(res, err);
        }
        if(!result){
            return result;
        }
        return result.dataValues;

    };

    static getOrderDetails =async(orderObj) => {
        console.log("order obj-- ", orderObj);
        let err, result;
        [err, result ]= await to(
            orderItemModel.findAndCountAll({
                attributes : ['productId', 'quantity'],
                where : {
                    orderId : orderObj.id,
                }
            })
        );
        console.log(err, result);
        if(err){
            return err;
        }
        orderObj.orderItems =result;
        
        return orderObj;
    };

}

module.exports =OrderService;


const orderNowProduct = async(req, res) => {
    const cid = req.customer.id;
    const pid = req.params.product_id;
    
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
    const dates = getOrderDates();
    [err, result] = await to(
        orderModel.create({
            customerId: cid,
            amount : productPrice,
            orderDate : dates.orderDate,
            deliveryDate : dates.deliveryDate,
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
    result.dataValues.amount =productPrice;
    
    return sendResponse(res, result);

}


const placeOrderFromCart = async(req, res) => {
    const cid = req.customer.id;
    let err, result;

    [err, result]= await to(checkAddressCreditCardService(req,res));
    if(err){
        return dbError(res, err);
    }else if(!result){
        return;
    }

    [err, result] = await to(cartController.getCartProductService(req,res));
    
    const dates = getOrderDates();
    const orderAmount = result.totalCartAmount;
    const cartItems = result.cartItems;
    [err, result] = await to(
        orderModel.create({
            customerId: cid,
            amount : orderAmount,
            orderDate : dates.orderDate,
            deliveryDate : dates.deliveryDate,

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
    
    
    if(err){
        return dbError(res, err);
    }


    return sendResponse(res, result);


}


// module.exports ={
//     orderNowProduct,
//     placeOrderFromCart,
// }