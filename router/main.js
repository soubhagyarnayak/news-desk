'use strict'

var pg = require("pg");
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json()

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
        pool.query('SELECT * FROM hackernewsarticles WHERE isread IS NULL AND isremoved IS NULL ORDER BY CreateTime DESC', function(err,result) {
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.render("hn",{articles:result.rows});
        });
    });
    app.post('/hn', jsonParser, function(req,res){
        var query = null;
        if(req.body.operation=='markRead'){
            query = "UPDATE hackernewsarticles SET isread = true WHERE id = $1";
        } else if(req.body.operation=='remove'){
            query = "UPDATE hackernewsarticles SET isremoved = true WHERE id =$1";
        }
        pool.query(query,[req.body.id],function(err,result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            } else{
                res.status(200).send("success");
            }
        });
    });
}