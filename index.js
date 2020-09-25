const express = require('express');
const { db_connect } = require('./lib/datacentre/mysql');



const app = express();

db_connect();

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server started on port`);
});