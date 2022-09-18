const express = require('express');
const request = require('request')
const app = express();
const PORT = 3000;
const TIMEOUT = 5 * 1000;

app.get('/', (req, res) => {
    res.status(200).send('ping');
});

app.get('/timeout', (req, res) => {
        setTimeout(() => {
            res.status(200).send('timeout');
        }, TIMEOUT);
});

//busywait
app.get('/heavy', (req, res) => {
    for (t =  new Date(); new Date() - t < TIMEOUT; );
    res.status(200).send('heavy');
});

app.get('/bbox1', (req, res) => {
    request.get('http://box:9090/').on('response', (response) => {
      console.log("bbox1 " + response.statusCode)
      res.send("bbox1 " + response.statusCode + "\n")
    })
});
  
app.get('/bbox2', (req, res) => {
    request.get('http://box:9091/').on('response', (response) => {
      console.log("bbox2 " + response.statusCode)
      res.send("bbox2 " + response.statusCode + "\n")
    })
});

app.listen (PORT, () => {
    console.log('Server is up on port 3000');
});