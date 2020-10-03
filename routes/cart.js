const router = require('express').Router();

const cartController = require('../controllers/cart');

const checkToken = require('../lib/middleware/authention');

router.use(checkToken); 

router.post('/:product_id', cartController.addProductToCard );

router.get('/', cartController.getCartProducts);

router.put('/:product_id', cartController.updateCartProduct);

router.delete('/', cartController.deleteAllProductsFromCart);

router.delete('/:product_id',  cartController.deleteProductFromCart);


module.exports = router;