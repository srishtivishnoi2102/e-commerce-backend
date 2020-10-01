const { default: to } = require('await-to-js');
const express = require('express');
const categoryController =  require('../controllers/category');
const checkToken = require('../lib/middleware/authention');


const router = express.Router();

router.post('/',checkToken, categoryController.addCategory);

router.get('/',checkToken, categoryController.getCategories);

router.get('/:category_id',checkToken, categoryController.getCategoryById );

router.get('/inProduct/:product_id',checkToken, categoryController.getCategoriesOfProduct );

module.exports = router ;
