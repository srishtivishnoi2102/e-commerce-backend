const router = require('express').Router();

const categoryController =  require('../controllers/category');

const checkToken = require('../lib/middleware/authention');


router.post('/',checkToken, categoryController.addCategory);

router.get('/', categoryController.getCategories);

router.get('/:category_id', categoryController.getCategoryById );

router.get('/inProduct/:product_id', categoryController.getCategoriesOfProduct );

module.exports = router ;
