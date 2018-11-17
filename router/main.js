'use strict'

var pg = require("pg");

var connectionString = "postgres://postgres:<pwd>@localhost:5432/feeds";
const pool = new pg.Pool({
    connectionString: connectionString,
  });

module.exports = function(app)
{
    app.get('/',function(req,res){
        res.send('News Reader');
	});
    app.get('/hn',function(req,res){
        //res.send('hackernews.html');
        pool.query('SELECT * FROM hackernewsarticles order by CreateTime DESC', function(err,result) {
            pool.end(); // closing the connection;
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
}