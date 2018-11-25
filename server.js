'use strict'

var express = require("express");
var app = express();

require('dotenv').config();


require('./router/main')(app);
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.listen(3000,'0.0.0.0',function(){
    console.log("news reader running on port 3000.");
});