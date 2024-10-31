const express = require('express');
const app = express();

app.use('/test/20', (req, res) => {
    res.send('test 20');
});

app.use('/test', (req, res) => {
    res.send('test');
});

app.use('/', (req, res) => {
    res.send('Hello, by default');
});

app.listen(3000, () => {
    console.log('Successfully listening on 3000');
})