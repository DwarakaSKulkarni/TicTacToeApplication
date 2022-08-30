const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
//const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

let history=[];

app.post('/move', (req, res) => {
    const move = req.body;

    console.log(move.history);
    history.push(move.history);

    res.send('{}');
});

app.listen(app.get('port'), () => console.log('Hello world app listening at ' + app.get('port')));


app.get('/currentMove', (req, res) => {
    res.json(history);
});
