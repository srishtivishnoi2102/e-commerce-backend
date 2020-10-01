const { default: to } = require('await-to-js');
const express = require('express');
const customerController =  require('../controllers/customer');
const checkToken = require('../lib/middleware/authention');


const router = express.Router();

router.post('/',customerController.registerCustomer);

router.post('/login',customerController.loginCustomer);

router.get('/',checkToken, customerController.getCustomerById);

router.put('/creditCard',checkToken, customerController.updateCreditCard );

router.put('/address',checkToken, customerController.updateAddress );

module.exports = router ;
