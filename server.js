'use strict'

var express = require("express");
var app = express();

require('./router/main')(app);
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

var server =  app.listen(3000,function(){
    console.log("news reader running on port 3000.");
});