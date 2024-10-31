const express = require('express');
const app = express();

app.get('/user', (req, res) => {
    res.send('User fetched successfully');
});

app.post('/user', (req, res) => {
    res.send('Inserted user successfully');
});

app.put('/user', (req, res) => {
    res.send('Updated user successfully');
});

app.delete('/user', (req, res) => {
    res.send('Deleted user successfully');
});

app.use('/', (req, res)=>{
    res.send('Default handling');
})

app.listen(3001, () => {
    console.log('Successfully listening on 3001 port')
})