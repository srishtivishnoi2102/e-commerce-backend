const router = require('express').Router();
const orderController = require('../controllers/order');
const checkToken = require('../lib/middleware/authention');

router.post('/buyNow/:product_id',checkToken,orderController.orderNowProduct);

router.get('/inCustomer/',checkToken,orderController.getAllOrdersOfCustomer);

router.get('/:order_id',checkToken,orderController.getOrderDetails);

router.post('/placeOrder', checkToken, orderController.placeOrderFromCart);




module.exports = router;