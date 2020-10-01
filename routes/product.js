const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const checkToken = require('../lib/middleware/authention');


router.post('/', productController.postProduct );

router.get('/', productController.getAllProducts );

router.get('/:product_id/', productController.getProductById );

router.get('/inCategory/:category_id', productController.getAllProductsWithCategoryId );


module.exports = router;