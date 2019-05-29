'use strict'

var express = require("express");
var morgan = require("morgan");

var app = express();

require('dotenv').config();

app.use(morgan('dev'));
require('./router/main')(app);
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.listen(3000,'0.0.0.0',function(){
    console.log("news reader running on port 3000.");
});