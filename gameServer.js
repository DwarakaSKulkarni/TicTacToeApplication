const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient
const url = require('url');
const querystring = require('querystring');


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));


app.post('/move', (req, res) => {
    const move = req.body;

    console.log(move);

    res.send(move);
});

app.listen(app.get('port'), () => console.log('REST api listening at ' + app.get('port')));


//Mongo DB Connection and query

/*MongoClient.connect('mongodb://localhost:27017', function(err, client){
  if(err) throw err;
  let db = client.db('gamedb');
  db.collection('user').find().toArray(function(err, result){
    if(err) throw err;
    console.log(result);
    client.close();
    });
 });*/


app.get('/state', (req, res) => {
  var state =null;
  let gameID = req.query.gameID;
  let userID = req.query.userID;
  console.log('get Method: ', gameID);
  console.log('get Method: ', userID);

  MongoClient.connect('mongodb://localhost:27017', function(err, client){
    if(err) throw err;
    let db = client.db('gamedb');
    var query = { gameId: gameID };
    var projectionParam={projection: { gameId: gameID, _id: 0 }};
    db.collection("games").find(query,projectionParam).toArray(function(err, result){
      if(err) throw err;
      console.log("gameId status in DB:",result.length);
      if(result.length===0){
        var myobj = { gameId: gameID, playerOneId: userID, playerTwoId: "", nextTurn: "X", state:[{}]};
        db.collection("games").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("Document with gameID and playerOneId created");
       });
      }
      else{
        var gameQuery = { gameId: gameID};
        var newvalues = { $set: {playerTwoId: userID} };
        db.collection("games").updateOne(gameQuery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("playerTwoId updated for the given gameID");
        });
      }
      db.collection("games").find(query).toArray(function(err,result){
        if(err) throw err;
        state=result[0];
        console.log("Get Method value-",state);
        res.json(state);
        client.close();
      });
    });
 });
});
