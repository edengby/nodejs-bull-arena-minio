const express = require('express');
const Arena = require('bull-arena');
const Bull = require('bull');
const app = express();

const queryConfig = [
    {
        name: 'files',
        hostId: 'bull',
        url: 'redis://redis:6379/0'
    },
    {
        name: 'files2',
        hostId: 'bull',
        url: 'redis://redis:6379/0'
    }
];

const arenaConfig = Arena({
    Bull,
    queues: queryConfig
    },
    {
        basePath: '/',
        disableListen: true
    });

app.use('/', arenaConfig);
app.listen(3033, () => console.log('Listening on port 3033!'));