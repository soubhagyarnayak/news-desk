'use strict'

var pg = require("pg");
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json()

var connectionString = `${process.env.DATABASE_CONNECTION_STRING}/feeds`;
const pool = new pg.Pool({
    connectionString: connectionString,
  });

module.exports = function(app)
{
    app.get('/',function(req,res){
        res.render('index');
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
    app.get('/settings',function(req,res){
        res.render('settings');
    });
    app.get('/oped', function(req,res){
        var query = 'SELECT OpEdArticle.Id,OpEdArticle.Link,OpEdArticle.Title,OpEdArticle.PublicationTime,OpEdCategory.Title AS CategoryTitle FROM OpEdArticle JOIN OpEdCategory ON OpEdArticle.CategoryId = OpEdCategory.Id WHERE IsRead IS NULL AND IsRemoved IS NULL ORDER BY PublicationTime DESC';
        pool.query(query, function(err,result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            var categoriesMap = {};
            var pending = 0;
            result.rows.forEach(function(row){
                if(!(row.categorytitle in categoriesMap)){
                    categoriesMap[row.categorytitle]=[];
                }
                categoriesMap[row.categorytitle].push({'id':row.id,'link':row.link,'title':row.title,'pubTime':row.publicationtime})
                pending++;
            });
            var categories = [];
            for(var key in categoriesMap){
                categories.push({'title':key,'articles':categoriesMap[key]});
            }
            res.render('oped',{categories:categories,pending:pending});
        });
    });
    app.post('/hn', jsonParser, function(req,res){
        var query = null;
        var args = [];
        if(req.body.operation=='markRead'){
            query = "UPDATE hackernewsarticles SET isread = true WHERE id = $1";
            args = [req.body.id];
        } else if(req.body.operation=='remove'){
            query = "UPDATE hackernewsarticles SET isremoved = true WHERE id =$1";
            args = [req.body.id];
        } else if(req.body.operation=='annotate'){
            query = "UPDATE hackernewsarticles SET tags = $1, notes=$2 WHERE id =$3";
            args = [req.body.tags,req.body.notes,req.body.id];
        }
        pool.query(query,args,function(err,result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            } else{
                res.status(200).send("success");
            }
        });
    });
    app.get('/hn/article', function(req,res){
        var query = "SELECT tags,notes,description FROM hackernewsarticles WHERE id=$1";
        var args = [req.query.id];
        pool.query(query,args,function(err,result){
            if(err){
                console.log(err);
                res.status(500).send(err);
            } else {
                var article = {};
                if(result.rows.length > 0){
                    var row = result.rows[0];
                    article = {'tags':row.tags,'notes':row.notes,'description':row.description}; 
                }
                res.status(200).send(article);
            }
        });
    });
    app.post('/oped/category', jsonParser, function(req,res){
        console.log(req.body);
        if(req.body.operation == 'insert'){
            var query = "INSERT INTO OpEdCategory (Link, Title, Description) VALUES ($1,$2,$3);";
            var args = [req.body.link,req.body.title,req.body.description];
            pool.query(query,args,function(err,result){
                if(err){
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send();
                }
            });
        }
    });
}