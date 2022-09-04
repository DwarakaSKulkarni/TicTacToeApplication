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


/*app.post('/move', (req, res) => {
    const move = req.body;

    console.log(move);

    res.send(move);
});
*/
app.post('/move', (req, res) => {
   // const move = req.body;
    var state =null;
    let gameID = req.body.gameId;
    let userID = req.body.userId;
    let cellIndex=req.body.cellIndex;
    let moveSymbol='X';
    console.log('post Method: ', gameID);
    console.log('post Method: ', userID);
    console.log('post Method: ', cellIndex);

    MongoClient.connect('mongodb://localhost:27017', function(err, client){
      if(err) throw err;
      let db = client.db('gamedb');
      let gameQuery = { gameId: gameID};
      let keyName = "state." + cellIndex;
      let newvalues = { $set: {[keyName]: moveSymbol}};
      db.collection('games').updateOne(gameQuery, newvalues, function(err, updateRes){
        if(err) throw err;
        console.log("/move:  ", updateRes);

        var query = { gameId: gameID };
        db.collection("games").find(query).toArray(function(err,result){
        if(err) throw err;
        state=result[0];
        console.log("/move response: ",result[0]);
        res.send(state);
        client.close();
      });
      });
    });
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
  let gameID = req.query.gameId;
  let userID = req.query.userId;
  let stateValue ={"0":null,"1":null,"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null};
  console.log('get Method: ', gameID);
  console.log('get Method: ', userID);

  MongoClient.connect('mongodb://localhost:27017', function(err, client){
    if(err) throw err;
    let db = client.db('gamedb');
    var query = { gameId: gameID };
    var projectionParam={projection: { gameId: true, _id: false, playerOneId: true}};
    db.collection("games").find(query,projectionParam).toArray(function(err, gameResult){
      if(err) throw err;
      console.log("gameId status in DB:",gameResult.length);
      if(gameResult.length===0){
        var myobj = { gameId: gameID, playerOneId: userID, playerTwoId: "", nextTurn: "X", state:{}};
        db.collection("games").insertOne(myobj, function(err, insertRes) {
          if (err) throw err;
          console.log("Document with gameID and playerOneId created");
          db.collection("games").find(query).toArray(function(err,freshGameResult){
            if(err) throw err;
            state=freshGameResult[0];
            console.log("Get Method value-",state);
            res.json(state);
            client.close();
          });
       });
      }
      else{
        if (gameResult[0].playerOneId != userID) {
          var gameQuery = { gameId: gameID};
          var newvalues = { $set: {playerTwoId: userID} };
          db.collection("games").updateOne(gameQuery, newvalues, function(err, updateRes) {
            if (err) throw err;
            console.log("playerTwoId updated for the given gameID");
            db.collection("games").find(query).toArray(function(err,freshGameResult) {
              if(err) throw err;
              state=freshGameResult[0];
              console.log("Get Method value-",state);
              res.json(state);
              client.close();
            });
          });
        } else {
          console.log("playerOneId already filled");
          db.collection("games").find(query).toArray(function(err,freshGameResult) {
              if(err) throw err;
              state=freshGameResult[0];
              console.log("Get Method value-",state);
              res.json(state);
              client.close();
            });
        }
      }
    });
 });
});
