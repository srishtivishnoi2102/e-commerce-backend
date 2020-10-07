const { default: to } = require('await-to-js');
const cartModel = require('../lib/datacentre/models/cart');
const ProductModel = require('../lib/datacentre/models/product');
const { db } = require('../lib/datacentre/mysql');
const { dbError, sendResponse } = require('../lib/utils/error_handler');
const { isNormalInteger } = require('../lib/utils/helper');

const addProductToCard = async(req, res) => {

    const cid = req.customer.id;
    const pid = req.params.product_id;
    
    if(!isNormalInteger(pid)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    let err, result;
    [err, result ]= await to(
        cartModel.findAndCountAll({
            where : {
                customerId : cid,
                productId : pid,
            }
        })
    );

    if(err){
        return dbError(res, err);
    }
    if(result.count){    
        let qty = parseInt(result.rows[0].dataValues.quantity);
        console.log("update qyantity only");
        //  update quantity only
        req.body.quantity = qty +1;
        return updateCartProduct(req, res);
        

    }else{
        [err, result ] = await to(cartModel.create({
            customerId : cid,
            productId : pid,
        }));

        if(err){
            dbError(res, err);
            
        }
        sendResponse(res, result);
    }

};

const getCartProductService = async(req, res) => {
    const cid = req.customer.id;
    let err, result;

    [err, result] = await to(
        cartModel.findAll({
            attributes :{
                exclude : ['id', 'customerId', 'productId'],
            },
            include : [{
                model : ProductModel,
                attributes : {
                    exclude : ['categoryId', 'description'],
                }         
            }],
            where : {
                customerId : cid,
            },
        })
    );

    let totalSum = 0;
    let qty, price;
    for(let i=0;i<result.length; i++){
        qty = parseInt(result[i].dataValues.quantity);
        price = parseInt(result[i].dataValues.product.dataValues.price);
        let calcPrice = qty*price;
        result[i].dataValues.sumPrice = calcPrice;
        totalSum += (calcPrice);
    }

    result.totalCartAmount = totalSum;
    let data= {};
    data.totalCartAmount = totalSum;
    data.cartItems = result;
    return data;
}

const getCartProducts = async(req, res) => {
    
    let [err, result] = await to(getCartProductService(req, res));
    if(err){
       return dbError(res, err);
    }

    return sendResponse(res, result);

};

const updateCartProduct = async(req, res) => {
    
    const cid = req.customer.id;
    const pid = req.params.product_id;
    let qty = req.body.quantity.toString();
    
    if(!isNormalInteger(pid)){
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
    if(parseInt(qty)==0){
        return deleteProductFromCart(req, res);
    }


    let err, result;

    [err, result] = await to(
        cartModel.update({
            quantity : qty,
        }, {
            where : {
                customerId : cid,
                productId : pid,
            }
        })
    )
    if(err){
        return dbError(res, err);
    }
    result = {
        message : "Updated product quantity successfully",
    };
    return sendResponse(res, result);

};

const deleteAllProductsFromCart = async(req, res) => {
    const cid = req.customer.id;
    let err, result;

    [err, result] = await to(
        cartModel.destroy({
            where : {
                customerId : cid,
            },
        })
    );


    if(err){
       return dbError(res, err);
    }

    return sendResponse(res, result);
};

const deleteProductFromCart = async(req, res) => {
    const cid = req.customer.id;
    const pid = req.params.product_id;
    
    if(!isNormalInteger(pid)){
        return res.json({
            success : false,
            message : "Invalid product id",
            data : null,
        });
    }
    let err, result;

    [err, result] = await to(
        cartModel.destroy({
            where : {
                customerId : cid,
                productId : pid,
            },
        })
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

    console.log(result);
    return sendResponse(res, result);

};


module.exports= {
    addProductToCard,
    getCartProducts,
    getCartProductService,
    updateCartProduct,
    deleteAllProductsFromCart,
    deleteProductFromCart,
}