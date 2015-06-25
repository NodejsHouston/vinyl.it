var Discogs = require('disconnect').Client;

var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

var ua = "Mobilecogs/0.1"; 
// Authenticate by consumer key and secret
var dis = new Discogs(ua,{
    consumerKey: 'uUqaEojxSkwaSwRcOFZL', 
    consumerSecret: 'QsERczRHPtnwCNfvAarOnizZLwaqkxHG'
}); 

var requestDataStore;
var accessDataStore;

var db = dis.database();

app.get('/authorize', function(req, res){
    var oAuth = new Discogs().oauth();
    oAuth.getRequestToken(
        'uUqaEojxSkwaSwRcOFZL', 
        'QsERczRHPtnwCNfvAarOnizZLwaqkxHG', 
        'http://localhost:8080/callback', 
        function(err, requestData){
            // Persist "requestData" here so that the callback handler can 
            // access it later after returning from the authorize url
            requestDataStore = requestData;
            res.redirect(requestData.authorizeUrl);
        }
    );
});

app.get('/callback', function(req, res){
    var oAuth = new Discogs(requestDataStore).oauth();
    oAuth.getAccessToken(
        req.query.oauth_verifier, // Verification code sent back by Discogs
        function(err, accessData){
            // Persist "accessData" here for following OAuth calls 
            accessDataStore = accessData;
            res.send('Received access token!');
        }
    );
});

app.get('/identity', function(req, res){
    var dis = new Discogs(accessDataStore);
    dis.identity(function(err, data){
    	console.log(data);
        res.send(data);
    });
});

app.get('/user', function(req, res){
	var dis = new Discogs(accessDataStore);
	dis.user(function(err, data){
    	console.log(data);
        res.send(data);
	});
});

app.get('/search/:id', function(req, res, next){
    // run your request.js script
    // when index.html makes the ajax call to www.yoursite.com/request, this runs
    // you can also require your request.js as a module (above) and call on that:
    var id = req.params.id;
	db.search(id, function(err, data){
			var artistResults = {};
			var masterResults = {};
			var labelResults = {};
			var releaseResults = {};

				for (var i in data.results) {
				    //console.log(data.results[i].type);

                	switch(data.results[i].type){
                		case "artist":
                			artistResults[i] = data.results[i];
                			break;
                		case "master":
                			masterResults[i] = data.results[i];
                			break;
                		case "label":
                			labelResults[i] = data.results[i];
                			break;
                		case "release":
                			releaseResults[i] = data.results[i];
                			break;
                	}


				}

                var resultJson = {};
                resultJson.artists = artistResults;
                resultJson.masters = masterResults;
                resultJson.labels = labelResults;
                resultJson.releases = releaseResults;

	    res.json(resultJson); // try res.json() if getList() returns an object or array
	});
});

app.listen(8080);