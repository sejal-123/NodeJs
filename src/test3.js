const express = require('express');
const app = express();

// ? signifies that previous might be present or not
// app.get('/user(ab)?', (req, res) => {
//     console.log(req.query);
//     res.send('User fetched successfully');
// });

// app.get('/usera?', (req, res) => {
//     console.log(req.query);
//     res.send('User fetched successfully');
// });

// * signifies that previous should be present 0 or more time
// app.get('/user(ab)*', (req, res) => {
//     console.log(req.query);
//     res.send('User fetched successfully');
// });

// + signifies that previous should be present 1 or more time
// app.get('/user(ab)*', (req, res) => {
//     console.log(req.query);
//     res.send('User fetched successfully');
// });

// Use of regex in routes
// app.get('/user/a/', (req, res) => {
//     console.log(req.query);
//     res.send('User fetched successfully');
// });

// app.get('/user/*berry$', (req, res) => {
//     console.log(req.query);
//     res.send('User fetched successfully');
// });

// reading query param in the routes
// localhost:3002/user?name=sejal&rno=13
// app.get('/user', (req, res) => {
//     console.log(req.query);
//     res.send('User fetched successfully');
// });

// reading dynamic routes
// localhost:3002/user/20
app.get('/user/:id', (req, res) => {
    console.log(req.params.id);
    res.send('User fetched successfully');
});

app.listen(3002, ()=> {
    console.log('Successfully listening on 3002 port');
});