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
    let gameId = req.body.gameId;
    let userId = req.body.userId;
    let cellIndex=req.body.cellIndex;

    console.log('post Method: ', gameId);
    console.log('post Method: ', userId);
    console.log('post Method: ', cellIndex);

    MongoClient.connect('mongodb://localhost:27017', function(err, client){
      if(err) throw err;
      let db = client.db('gamedb');
      let gameQuery = { gameId: gameId};
      var projectionParam={projection: { playerOneId: true, playerTwoId: true, nextTurn: true, _id: false}};
      db.collection('games').find(gameQuery,projectionParam).toArray(function(err, gameResult){
        if(err) throw err;
        console.log("/move nextTurn:  ", gameResult[0].nextTurn);
        let moveSymbol=gameResult[0].nextTurn;
        let nextTurn = moveSymbol==='X'?'O':'X';
        let keyName = "state." + cellIndex;
        let newvalues = { $set: {[keyName]: moveSymbol, nextTurn: nextTurn}};

        db.collection('games').updateOne(gameQuery, newvalues, function(err, updateRes){
          if(err) throw err;
          console.log("/move:  ", updateRes);

          var query = { gameId: gameId };
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
  let gameId = req.query.gameId;
  let userId = req.query.userId;
  let stateValue ={"0":null,"1":null,"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null};

  console.log('get Method gameId: ', gameId);
  console.log('get Method userId: ', userId);

  MongoClient.connect('mongodb://localhost:27017', function(err, client){
    if(err) throw err;
    let db = client.db('gamedb');
    var query = { gameId: gameId };
    var projectionParam={projection: { gameId: true, _id: false}};
    db.collection("games").find(query,projectionParam).toArray(function(err, gameResult){
      if(err) throw err;
      console.log("gameId status in DB:",gameResult.length);
      if(gameResult.length===0){
        var myobj = { gameId: gameId, playerOneId: userId, playerTwoId: "", nextTurn: "X", state:{}};
        db.collection("games").insertOne(myobj, function(err, insertRes) {
          if (err) throw err;
          console.log("Document with gameId and playerOneId created");
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
        if (gameResult[0].playerOneId != userId) {
          var gameQuery = { gameId: gameId};
          var newvalues = { $set: {playerTwoId: userId} };
          db.collection("games").updateOne(gameQuery, newvalues, function(err, updateRes) {
            if (err) throw err;
            console.log("playerTwoId updated for the given gameId");
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
