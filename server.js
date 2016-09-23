var imgsearch = require('./modules/image-search.js');
var express = require('express');
var port = process.env.PORT || 8080;
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;

//INSTRUCTIONS//
app.use('/', express.static(__dirname + '/public'));

//SEARCH//
app.get('/api/imagesearch/*', function(req,res) {
    var query = req.params[0];
    var count = req.query['count'] || '';
    var callback = function(output) {
        res.end(JSON.stringify(output));
    };
    imgsearch(query, count, callback);
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        var searches = db.collection('searches');
        searches.insert({searchterm: query, time: new Date(Date.now())}, function(err, data) {
            if(err) throw err;
            console.log('Added ' + data.ops[0].searchterm.toString() + ' at ' + data.ops[0].time.toString());
        });
        db.close();
    });
});

//RECENT SEARCHES//
app.get('/latest/imagesearch/', function(req,res) {
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        var searches = db.collection('searches');
        searches.find({},{_id:0}).sort({time:-1}).limit(10).toArray(function(err, documents) {
            if(err) throw err;
            res.end(JSON.stringify(documents));
        });
        db.close();
    });
});

app.listen(port);