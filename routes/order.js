const router = require('express').Router();

const orderController = require('../controllers/order');

const checkToken = require('../lib/middleware/authention');

router.use(checkToken);

router.post('/buyNow/:product_id', orderController.orderNowProduct);

router.get('/inCustomer/', orderController.getAllOrdersOfCustomer);

router.get('/:order_id', orderController.getOrderDetails);

router.post('/placeOrder',  orderController.placeOrderFromCart);


module.exports = router;