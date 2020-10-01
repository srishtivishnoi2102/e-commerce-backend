const express = require('express');
const customerRouter = require('./customer');
const categoryRouter = require('./category');
const productRouter = require('./product');


const router = express.Router();

router.use('/customer',customerRouter);

router.use('/category',categoryRouter);

router.use('/product',productRouter);





module.exports =router;
