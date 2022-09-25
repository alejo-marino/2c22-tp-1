const express = require('express');
const request = require('request');
const uuid = require('uuid');

const app = express();
const id = uuid.v4();
const PORT = 3000;
const TIMEOUT = 5 * 1000;

app.get('/', (req, res) => {
    res.status(200).send(`[${id}] ping\n`);
});

app.get('/timeout', (req, res) => {
        setTimeout(() => {
            res.status(200).send(`[${id}] timeout\n`);
        }, TIMEOUT);
});

//busywait
app.get('/heavy', (req, res) => {
    for (t =  new Date(); new Date() - t < TIMEOUT; );
    res.status(200).send(`[${id}] heavy\n`);
});

app.get('/bbox1', (req, res) => {
    request.get('http://box:9090/').on('response', (response) => {
      console.log(`[${id}] bbox1 ` + response.statusCode)
      res.send(`[${id}] bbox1 ` + response.statusCode + "\n")
    })
});
  
app.get('/bbox2', (req, res) => {
    request.get('http://box:9091/').on('response', (response) => {
      console.log(`[${id}] bbox2 ` + response.statusCode)
      res.send(`[${id}] bbox2 ` + response.statusCode + "\n")
    })
});

app.listen (PORT, () => {
    console.log(`[${id}] Server is up on port`, PORT);
});