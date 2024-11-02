const express = require('express');
const app = express();
// ----- Error handling -----
// app.get('/getAllData', (req, res) => {
//     throw new Error('Error');
//     res.send('output');
// });

// // Wildcard match
//  note: if wildcard match is added to the top, it will not handle any of the occuring error
// Thats why we should keep it at the end
// app.use('/', (err, req, res, next) => {
//     if (err) {
//         res.status(500).send('Something went wrong');
//     }
// });

// Using try catch - ideal way of handling errors
app.get('/getAllData', (req, res) => {
    try {
        throw new Error('Error');
        res.send('output');
    } catch(err) {
        res.status(500).send('Something went wrong in try');
    }
});

app.listen(3005, () => {
    console.log('Successfully listening on port 3005');
});