const express = require('express');
const bodyParser=require('body-parser');
const { db_connect } = require('./lib/datacentre/mysql');
const routes = require('./routes/route');

require('dotenv').config();

const app = express();

db_connect();

app.use(express.json());
app.use(bodyParser.json());

app.use('/', routes);

const PORT = process.env.PORT || 3040;
app.listen(PORT, () => {
    console.log(`Server started on port`);
});