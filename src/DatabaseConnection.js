const express = require('express');
const app = express();
const connectDB = require('./config/database')
const User = require('./models/user');

app.post('/signup', async (req, res) => {
    // creating a new instance of the User model
    const user = new User({
        firstName: 'Sejal',
        lastName: 'Budhani',
        emailId: 'test@t.com',
        password: 'test123',
        age: 10
    });
    try {
        await user.save();
        res.send('User added successfully');
    } catch(e) {
        res.status(400).send('Error saving user' + e.message);
    }
});

connectDB()
.then(() => {
    console.log('Database connection established');
    app.listen('7777', () => {
        console.log('Port 7777 listening');
    })
})
.catch(() => {
    console.log('Database cannot be connected');
})

// Steps to connect to a database
// - Create a free cluster on mongodb website
// - Install mongoose library
// - connect your application to the database 'Connection-url/DevTinder'
// - call the connectDB function and connect to database before starting appn on 7777
// - create a UserSchema and a user model
// - create a post /signup api to add data to database
// - push some documents using api calls from postman
// - error handling using try catch