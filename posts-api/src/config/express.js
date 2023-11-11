const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('../app/routes/routes');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
routes(app);

module.exports = app;
