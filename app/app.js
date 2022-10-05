const express = require('express');
const request = require('request');
const uuid = require('uuid');
const SDC = require('statsd-client')

const app = express();
const id = uuid.v4();
const PORT = 3000;
const TIMEOUT = 5 * 1000;

// sdc = new SDC({host: 'localhost', port: 8125});
var lynx = require('lynx');
var metrics = new lynx('graphite', 8125);

app.get('/', (req, res) => {
    // const begin = new Date();
    // sdc.timing('helloserver.hello-world.request-time', begin);
    // sdc.increment('helloserver.hello-world.request-count');
    // sdc.gauge('some.gauge', 10); // Set gauge to 10
    let start = new Date().getTime()

    console.log('Creo una metrica');

    metrics.increment('node_test.int');
    metrics.decrement('node_test.int');
    metrics.timing('node_test.some_service.task.time', 500); // time in ms
    metrics.gauge('fromcode.one', 100);
    metrics.set('set.one', 10);

    
    let end = new Date().getTime()
    let elapsedTime = end - start;
    console.log('Tiempo de ejecucion: ' + elapsedTime + ' ms');
    metrics.gauge('server.responsetime', elapsedTime);

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