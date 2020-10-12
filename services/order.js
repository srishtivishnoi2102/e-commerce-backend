const { default: to } = require("await-to-js");

const orderModel = require('../lib/datacentre/models/order');
const orderItemModel = require('../lib/datacentre/models/orderItem');

const { getOrderDates } = require("../lib/utils/helper");

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
