'use strict'

module.exports = function(app)
{
    app.get('/',function(req,res){
        res.send('News Reader');
	});
    app.get('/hn',function(req,res){
        res.render('hackernews.html')
    });
}