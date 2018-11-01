const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer  = require('multer');
const db = require('./db');
const api = require('./api');
const app = express();

app.set('port', (process.env.port || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(api);


app.listen(app.get('port'), function () {
  console.log('Visit http://localhost:' + app.get('port'));
});