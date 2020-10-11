const { default: to } = require('await-to-js');

const cartModel = require('../lib/datacentre/models/cart');
const ProductModel = require('../lib/datacentre/models/product');
const error_handler = require('../lib/utils/error_handler');


class CartService {

    static getCartProducts = async(customerId) => {
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
                    customerId : customerId,
                },
            })
        );

        if(err){
            return err ;
        }
    
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

    static checkIfProductExistsinCart = async(customerId,productId) => {
        let err, result;
        [err, result ]= await to(
            cartModel.findOne({
                where: {
                    customerId : customerId,
                    productId : productId,
                },
                attributes :['quantity'],
            })
        );
        if(err){
            return err;
        }
        if(!result){
            return result;
        }
        return result.dataValues;

    };

    static addNewProductToCard = async(customerId, productId) => {
        let err, result;
        [err, result ] = await to(cartModel.create({
            customerId : customerId,
            productId : productId,
        }));

        if(err){
            return err;
            
        }
        return result;

    };

    static updateCartProductQuantity = async(customerId, productId, qty) => {
        let err, result;

        [err, result] = await to(
            cartModel.update({
                customerId : customerId,
                productId : productId,
                quantity : qty,
            }, {
                where : {
                    customerId : customerId,
                    productId : productId,
                }
            })
        )
        if(err){
            return err;
        }
        result = {
            message : "Updated product quantity successfully",
        };
        return result;
    };

    static deleteProductFromCart = async(customerId, productId) => {
        let err, result;

        [err, result] = await to(
            cartModel.destroy({
                where : {
                    customerId : customerId,
                    productId : productId,
                },
            })
        );


        if(err){
            return err;
            }
        return result;

    };
    
    static deleteAllProductsFromCart = async(customerId) => {
        let err, result;

        [err, result] = await to(
            cartModel.destroy({
                where : {
                    customerId : customerId,
                },
            })
        );


        if(err){
            return err;
        }
        return result;

    };
    
}

module.exports = CartService;

