const express = require('express');
const bodyParser=require('body-parser');
const { db_connect } = require('./lib/datacentre/mysql');
const routes = require('./routes/route');
const Customer = require('./lib/datacentre/models/customer');
const Cart = require('./lib/datacentre/models/cart');
const Product = require('./lib/datacentre/models/product');
const Category = require('./lib/datacentre/models/category');
const Review = require('./lib/datacentre/models/review');

require('dotenv').config();

const app = express();

// db_connect();

// Model Asssociations




app.use(express.json());
app.use(bodyParser.json());

app.use('/', routes);

const PORT = process.env.PORT || 3040;
app.listen(PORT, () => {
    console.log(`Server started on port`);
});