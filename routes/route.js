const express = require('express');

const customerRouter = require('./customer');
const categoryRouter = require('./category');
const productRouter = require('./product');
const cartRouter = require('./cart');
const orderRouter = require('./order');

const router = express.Router();

router.use('/customer',customerRouter);

router.use('/category',categoryRouter);

router.use('/product',productRouter);

router.use('/cart', cartRouter);

router.use('/order', orderRouter);


module.exports =router;
