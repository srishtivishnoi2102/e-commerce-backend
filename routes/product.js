const router = require('express').Router();

const productController = require('../controllers/product');
const reviewController = require('../controllers/review');

const checkToken = require('../lib/middleware/authention');

router.post('/', checkToken, productController.postProduct );

router.get('/', productController.getAllProducts );

router.get('/:product_id/', productController.getProductById );

router.get('/inCategory/:category_id', productController.getAllProductsWithCategoryId );

router.get('/:product_id/details', productController.getProductDetails );

router.get('/:product_id/reviews', reviewController.getProductReviews );

router.post('/:product_id/reviews',checkToken, reviewController.postReview );

module.exports = router;