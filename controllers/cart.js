const { default: to } = require('await-to-js');

const { dbError, sendResponse } = require('../lib/utils/error_handler');
const { isNormalInteger } = require('../lib/utils/helper');

const CartService = require('../services/cart');

const addProductToCard = async(req, res) => {

    const customerId = req.customer.id;
    const productId = req.params.product_id;
    
    if(!isNormalInteger(productId)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    let err, result;
    [err, result ]= await to(
        CartService.checkIfProductExistsinCart(customerId, productId)
    );

    if(err){
        return dbError(res, err);
    }

    if(!result){
        [err, result]= await to(CartService.addNewProductToCard(customerId, productId));
    }else{
        let qty = 1 + parseInt(result.quantity);
        [err, result]= await to(CartService.updateCartProductQuantity(customerId, productId, qty));
    }

    if(err){
        return dbError(res, err);
    }
    return sendResponse(res, result);
};


const getCartProducts = async(req, res) => {
    const customerId = req.customer.id;

    let [err, result] = await to(CartService.getCartProducts(customerId));
    if(err){
       return dbError(res, err);
    }

    return sendResponse(res, result);

};

const updateCartProduct = async(req, res) => {
    
    const customerId = req.customer.id;
    const productId = req.params.product_id;
    let qty = req.body.quantity.toString();
    
    if(!isNormalInteger(productId)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }

    if(!isNormalInteger(qty)){
        return res.json({
            success : false,
            message : "Invalid quantity",
            data : null,
        });
    }
    let err, result;

    if(parseInt(qty)==0){
        [err, result]= await to(CartService.deleteProductFromCart(customerId, productId));

    }else{
        [err, result]= await to(CartService.updateCartProductQuantity(customerId, productId, qty));
    }

    
    if(err){
        return dbError(res, err);
    }

    return sendResponse(res, result);

};

const deleteAllProductsFromCart = async(req, res) => {
    const customerId = req.customer.id;
    let err, result;

    [err, result] = await to(
        CartService.deleteAllProductsFromCart(customerId)
    );


    if(err){
       return dbError(res, err);
    }
    result = {message :"Successfully deleted all products from cart"};

    return sendResponse(res, result);
};

const deleteProductFromCart = async(req, res) => {
    const customerId = req.customer.id;
    const productId = req.params.product_id;
    
    if(!isNormalInteger(productId)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    let err, result;

    [err, result] = await to(
       CartService.deleteProductFromCart(customerId, productId)
    );


    if(err){
       return dbError(res, err);
    }
    if(result==0){
        return  res.json({
            success :false,
            message : "This product is not present in cart"
        });
    }
    result = {message :"Successfully deleted product from cart"};
    console.log(result);
    return sendResponse(res, result);

};


module.exports= {
    addProductToCard,
    getCartProducts,
    updateCartProduct,
    deleteAllProductsFromCart,
    deleteProductFromCart,
}