const express = require('express');
const bodyParser=require('body-parser');
require('dotenv').config();

const { db_connect } = require('./lib/datacentre/mysql');

const routes = require('./routes/route');

const Cart = require('./lib/datacentre/models/cart');
const Product = require('./lib/datacentre/models/product');
const OrderItem = require('./lib/datacentre/models/orderItem');
const Order = require('./lib/datacentre/models/order');
const Customer = require('./lib/datacentre/models/customer');



const app = express();

// db_connect();

// Model Asssociations

Cart.belongsTo(Product);
OrderItem.belongsTo(Order);
OrderItem.hasMany(Product, {foreignKey: 'id'});
Order.hasMany(OrderItem);
Order.belongsTo(Customer);




app.use(express.json());
app.use(bodyParser.json());

app.use('/', routes);

const PORT = process.env.PORT || 3040;
app.listen(PORT, () => {
    console.log(`Server started on port`);
});