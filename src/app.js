const express = require('express');
const app = express();

app.use('/test', (req,res) => {
    res.send('Hello from server');
})
app.use('/hello', (req,res) => {
    res.send('Hello.....');
})
app.use('/', (req,res) => {
    res.send('Default');
})
app.listen(7777, () => {
    console.log('succesfully listening on 7777 port');
});