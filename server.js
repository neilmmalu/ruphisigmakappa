var http = require('http');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;


/*****************ROUTES********************/
app.get('/', function(req,res){
	res.redirect('/home.html');
});

app.use('/assets', express.static('assets'));


app.get('/home.html', function(req,res){
	res.sendFile(__dirname + "/views/home.html");
});

app.get('/about.html', function(req,res){
	res.sendFile(__dirname + "/views/about.html");
});

app.get('/alumni.html', function(req,res){
	res.sendFile(__dirname + "/views/alumni.html");
});

app.get('/awards.html', function(req,res){
	res.sendFile(__dirname + "/views/awards.html");
});

app.get('/brothers.html', function(req,res){
	res.sendFile(__dirname + "/views/brothers.html");
});

app.get('/cardinal_principles.html', function(req,res){
	res.sendFile(__dirname + "/views/cardinal_principles.html");
});

app.get('/contact_us.html', function(req,res){
	res.sendFile(__dirname + "/views/contact_us.html");
});

app.get('/creed.html', function(req,res){
	res.sendFile(__dirname + "/views/creed.html");
});

app.get('/donate.html', function(req,res){
	res.sendFile(__dirname + "/views/donate.html");
});

app.get('/members.html', function(req,res){
	res.sendFile(__dirname + "/views/members.html");
});

app.get('/philantropy.html', function(req,res){
	res.sendFile(__dirname + "/views/philantropy.html");
});

app.get('/rush.html', function(req,res){
	res.sendFile(__dirname + "/views/rush.html");
});

app.get('/schedule.html', function(req,res){
	res.sendFile(__dirname + "/views/schedule.html");
});


app.get('/party', function(req, res){
	res.sendFile(__dirname + "/views/party.html");
});

app.get('/party/number', function(req, res){
	getPeople(res);
});

app.get('/party/add', function(req, res){
	changeByPerson(res, 1);
});

app.get('/party/subtract', function(req, res){
	changeByPerson(res, -1);
});

app.get('/body_count.js', function(req, res){
	res.sendFile(__dirname + "/assets/js/body_count.js");
});


/***********FUNCTIONS************/

function getPeople(res){
  MongoClient.connect('mongodb://localhost:27017/party', function(err, db) {
    if (err) {
      throw err;
    }
    db.collection('people').find({people: { $exists: true }}).toArray(function(err, doc){
      if(!doc.length || doc[0].people == null){
        db.collection('people').insert({people: { current: 0, peak: 0}});
        return 0;
      }
      const people = doc[0].people.current;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ "people":people}));
    })
   });
}

function peakCheck(people){
  MongoClient.connect('mongodb://localhost:27017/party', function(err, db) {
    if (err) {
      throw err;
    }
    db.collection('people').find({people: { $exists: true }}).toArray(function(err, doc){
      if(!doc.length || doc[0].people == null){
        db.collection('people').insert({people: { current: people, peak: people}});
        return 0;
      }
      var current = doc[0].people.current;
      var peak = doc[0].people.peak;
      db.collection('people').update({people: { $exists: true }},{people: { current: current, peak: Math.max(peak, people)}});
    })
   });
}

function changeByPerson(res, number){
  MongoClient.connect('mongodb://localhost:27017/party', function(err, db) {
    if (err) {
      throw err;
    }
    db.collection('people').find({people: { $exists: true }}).toArray(function(err, doc){
      if(!doc.length || doc[0].people == null){
        db.collection('people').insert({people: { current: 0, peak: 0}});
        return 0;
      }
      var people = doc[0].people.current + number;
      var peak = doc[0].people.peak;
      if(people < 0){
        people = 0;
      }
      peakCheck(people);
      db.collection('people').update({people: { $exists: true }},{people: { current: people, peak: Math.max(peak, people)}});
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ "people":people}));
    })
   });
}

/******************SERVER START****************/

var server = app.listen(8080);