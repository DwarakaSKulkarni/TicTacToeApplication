const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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


app.get('/currentMove', (req, res) => {
    const state = {"state": {"4":"X"} };
    res.json(state);
});
