const express = require('express');
const app = express();
const connectDB = require('./config/database')
const User = require('./models/user');

// converting the json from the req body to a js object
app.use(express.json());
app.post('/signup', async (req, res) => {
    console.log(req.body);
    // creating a new instance of the User model
    const user = new User(req.body);
    try {
        await user.save();
        res.send('User added successfully');
    } catch(e) {
        res.status(400).send('Error saving user' + e.message);
    }
});

// Get user by email
app.get('/user', async (req, res) => {
    console.log(req.body.emailId);
    try{
        // const users = await User.findOne({ emailId: req.body.emailId });
        const users = await User.find({ emailId: req.body.emailId });
        if (users.length > 0) {
            res.send(users);
        } else {
            res.send('User not found');
        }
    } catch(e) {
        res.send('Something went wrong');
    }
});

// Get user by id
app.get('/userById', async (req, res) => {
    console.log(req.body.id);
    try{
        const user = await User.findById(req.body.id);
        if (user) {
            res.send(user);
        } else {
            res.send('User not found');
        }
    } catch(e) {
        res.send('Something went wrong');
    }
});

// Get all users
app.get('/feed', async (req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    } catch(e) {
        res.send('Something went wrong');
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