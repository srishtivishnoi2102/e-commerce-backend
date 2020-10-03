const router = require('express').Router();

const customerController =  require('../controllers/customer');
const checkToken = require('../lib/middleware/authention');

router.post('/',customerController.registerCustomer)

router.post('/login',customerController.loginCustomer);

router.get('/',checkToken, customerController.getCustomerById);

router.put('/creditCard',checkToken, customerController.updateCreditCard );

router.put('/address',checkToken, customerController.updateAddress );

module.exports = router ;
