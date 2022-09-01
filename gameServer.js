const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient


const app = express();
//const port = 3000;

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

MongoClient.connect('mongodb://localhost:27017/animals', (err, db) => {
  console.log("MongoDB Connected");
  if (err) throw err

  /*db.collection('mammals').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
  })*/
})


app.get('/currentMove', (req, res) => {
    const state = {"state": {"4":"X"} };
    res.json(state);
});
