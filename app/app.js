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

const GAUGE_NAME = 'server.responsetime';

app.get('/', (req, res) => {
    let start = new Date().getTime()
    let end = new Date().getTime()
    let elapsedTime = end - start;
    console.log('Tiempo de ejecucion: ' + elapsedTime + ' ms');
    metrics.gauge(GAUGE_NAME, elapsedTime);

    res.status(200).send(`[${id}] ping\n`);
});

app.get('/timeout', (req, res) => {
        setTimeout(() => {
            res.status(200).send(`[${id}] timeout\n`);
        }, TIMEOUT);
});

//busywait
app.get('/heavy', (req, res) => {
    let start = new Date().getTime()

    for (t =  new Date(); new Date() - t < TIMEOUT; );

    let end = new Date().getTime()
    let elapsedTime = end - start;
    console.log('Tiempo de ejecucion: ' + elapsedTime + ' ms');
    metrics.gauge(GAUGE_NAME, elapsedTime);

    res.status(200).send(`[${id}] heavy\n`);
});

app.get('/bbox1', (req, res) => {
    var start = new Date().getTime()

    request.get('http://box:9090/').on('response', (response) => {
        console.log(`[${id}] bbox1 ` + response.statusCode)
        let end = new Date().getTime()
        let elapsedTime = end - start;
        console.log('Tiempo de ejecucion: ' + elapsedTime + ' ms');
        metrics.gauge(GAUGE_NAME, elapsedTime);
        res.send(`[${id}] bbox1 ` + response.statusCode + "\n")
    })
});
app.get('/bbox2', (req, res) => {
    var start = new Date().getTime()

    request.get('http://box:9091/').on('response', (response) => {
        console.log(`[${id}] bbox2 ` + response.statusCode)
        let end = new Date().getTime()
        let elapsedTime = end - start;
        console.log('Tiempo de ejecucion: ' + elapsedTime + ' ms');
        metrics.gauge(GAUGE_NAME, elapsedTime);
        res.send(`[${id}] bbox2 ` + response.statusCode + "\n")
    })
});

//inscripciones
app.get('/inscripciones/login', (req, res)=>{

    res.status(200).send(`login sistema inscripciones`);
})


app.get('/inscripciones/logout', (req, res)=>{

    res.status(200).send(`logout inscripciones`);
})

app.get('/inscripciones/materias', (req, res)=>{

    res.status(200).send(`lista materia inscripto`);
})

app.get('/inscripciones/materiasdisponibles', (req, res)=>{

    res.status(200).send(`lista materias disponibles`);
})

app.get('/inscripciones/inscribirse', (req, res)=>{

    res.status(200).send(`materia inscribirse`);
})

app.get('/inscripciones/carrera', (req, res)=>{

    res.status(200).send(`seleccionar  una carrera`);
})

app.listen (PORT, () => {
    console.log(`[${id}] Server is up on port`, PORT);
});