const { default: to } = require('await-to-js');
const express = require('express');
const categoryController =  require('../controllers/category');
const checkToken = require('../lib/middleware/authention');


const router = express.Router();

router.post('/',checkToken, categoryController.addCategory);

router.get('/', categoryController.getCategories);

router.get('/:category_id', categoryController.getCategoryById );

router.get('/inProduct/:product_id', categoryController.getCategoriesOfProduct );

module.exports = router ;
