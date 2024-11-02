const express = require('express');
const app = express();


//Multiple request handlers

// app.use('/user', (req, res, next) => {
//     console.log('in user 1');
//     next();
// });
// In between ones are called middlewares
// app.use('/user', (req, res, next) => {
//     console.log('in user 2');
//     next();
// });
// And the last ones which return response are called request handler
// app.use('/user', (req, res, next) => {
//     console.log('in 3rd handler');
//     res.send('User fetched successfully.');
// });

// Multiple request handlers ('/request', rh1, [rh2, rh3], rh4)
app.get('/user', (req, res, next) => {
    console.log('in 1st rh');
    next();
}, (req, res, next) => {
    console.log('in 2nd rh');
    next();
}, (req, res, next) => {
    console.log('in 3rd handler');
    res.send('User fetched successfully.');
});

app.use('/', (req, res) => {
    res.send('Hello, from default');
});

app.listen(3003, () => {
    console.log('Successfully listening on port 3003');
})