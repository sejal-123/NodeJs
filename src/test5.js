const express = require('express');
const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth');

// app.get('/admin/getAllData', (req, res, next) => {
//     const token = 'aaa';
//     if (token === 'xyz') {
//         res.send('Details fetched.');
//     } else {
//         res.status(401).send('Unauthorized user');
//     }
// });

// app.get('/admin/deleteUser', (req, res, next) => {
//     const token = 'xyz';
//     if (token === 'xyz') {
//         res.send('User deleted.');
//     } else {
//         res.status(401).send('Unauthorized user');
//     }
// });

// Here we are writing all the code repetitively, in such a case we can use middleware...

// app.use('/admin', (req, res, next) => {
//     console.log('Authenticating admin...');
//     const token = 'xyz';
//     if (token === 'xyz') {
//         next();
//     } else {
//         res.status(401).send('Unauthorized user');
//     }
// });

// app.get('/admin/getAllData', (req, res, next) => {
//     res.send('Details fetched.');
// });

// app.get('/admin/deleteUser', (req, res, next) => {
//     res.send('User deleted.');
// });

// We can create a admin auth seperately in a file

app.use('/admin', adminAuth);

app.get('/admin/getAllData', (req, res, next) => {
    res.send('Details fetched.');
});

app.get('/admin/deleteUser', (req, res, next) => {
    res.send('User deleted.');
});

// We can also write it as short notation

app.get('/user/getAllData', userAuth, (req, res, next) => {
    res.send('Details fetched.');
});

app.get('/user/deleteUser', userAuth, (req, res, next) => {
    res.send('User deleted.');
});

app.listen(3004, () => {
    console.log('Successfully listening on port 3004');
});