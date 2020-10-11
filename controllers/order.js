const { default: to } = require("await-to-js");

const orderModel = require('../lib/datacentre/models/order');
const orderItemModel = require('../lib/datacentre/models/orderItem');
const productModel = require('../lib/datacentre/models/product');
const cartModel = require("../lib/datacentre/models/cart");

const cartController = require('./cart');

const { sendResponse, dbError } = require("../lib/utils/error_handler");
const { isNormalInteger } = require("../lib/utils/helper");
const OrderService = require("../services/order");
const CustomerService = require("../services/customer");
const CartService = require("../services/cart");
const ProductService = require("../services/product");

const orderNowProduct = async(req, res) => {
    const productId = req.params.product_id;
    const customerId = req.customer.id;

    if (! isNormalInteger(productId)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    let err, result;

    [err, result]= await to(CustomerService.checkAddressCreditCardAvailable(customerId));
    if(err){
        return dbError(res, err);
    }
    if(!result){
        return;
    }

    [err, result] = await to(
        ProductService.getProductById(productId)
    );
    if(err){
        return dbError(res, err);
    }
    if(!result){
        return  res.json({
            success : false,
            data : null,
            message : "Product does not exist",
        });
    }


    const orderAmount = result.dataValues.price;

    [err, result] = await to(OrderService.createNewOrder(customerId, orderAmount));
    if(err){
        return dbError(res, err);
    }
    
    const orderId = result.dataValues.id;

    const orderItemsArray= [{
        orderId: orderId,
        productId: productId,
        quantity : 1,
    }];

    [err, result] = await to( 
        OrderService.putItemsInOrder(orderItemsArray)
    )
    if(err){
        return dbError(res, err);
    }
    return sendResponse(res, result);

}

const getAllOrdersOfCustomer = async(req, res) => {
    const customerId = req.customer.id;
    let err, result;

    [err, result] = await to(OrderService.getAllOrdersOfCustomer(customerId));

    if(err){
        return dbError(res, err);
    }
    
    return sendResponse(res, result);

}

const getOrderDetails = async(req, res) => {
    const customerId = req.customer.id;
    const orderId = req.params.order_id;

    if (! isNormalInteger(orderId)){
        return res.json({
            success : false,
            message : "Invalid order id",
            data : null,
        });
    }

    let err, result;
    [err, result]= await to(
        OrderService.checkIfOrderExists(orderId)
    );

    if(err){
        return dbError(res, err);
    }

    if(!result){
        return  res.json({
            success : false,
            message : "No order exists with order id : "+orderId,
            data : null,
        });
    }
   
    if(result.customerId != customerId){
        return  res.json({
            success : false,
            message : "Not authorised for this order",
            data : null
        });
    }

    [err, result ]= await to(
        OrderService.getOrderDetails(result)
    );
    
    return sendResponse(res, result);

}

const placeOrderFromCart = async(req, res) => {
    const customerId = req.customer.id;
    let err, result;

    [err, result]= await to(CustomerService.checkAddressCreditCardAvailable(customerId));
    if(err){
        return dbError(res, err);
    }
    if(!result){
        return;
    }

    [err, result] = await to(cartController.getCartProductService(req,res));
        
    const orderAmount = result.totalCartAmount;
    const cartItems = result.cartItems;

    [err, result] = await to(OrderService.createNewOrder(customerId, orderAmount));
    console.log("create order : ",err, result);
    if(err){
        return dbError(res, err);
    }
    
    const orderId = result.dataValues.id;

    let orderItemsArray = OrderService.cartOrderHelper(orderId, cartItems);

    //  remove all items from from cart
    [err, result] = await to( CartService.deleteAllProductsFromCart(customerId) );
    
    if(err){
        return dbError(res, err);
    }

    //  insert into order item table
    [err, result] = await to( 
        OrderService.putItemsInOrder(orderItemsArray)
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