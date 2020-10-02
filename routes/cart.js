const router = require('express').Router();
const cart = require('../controllers/cart');
const cartController = require('../controllers/cart');
const checkToken = require('../lib/middleware/authention');


router.post('/:product_id', checkToken, cartController.addProductToCard );

router.get('/', checkToken, cartController.getCartProducts);

router.put('/:product_id', checkToken, cart.updateCartProduct);

router.delete('/', checkToken, cartController.deleteAllProductsFromCart);

router.delete('/:product_id', checkToken, cart.deleteProductFromCart);


module.exports = router;