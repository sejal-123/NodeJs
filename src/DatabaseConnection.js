const express = require('express');
const app = express();
const connectDB = require('./config/database')
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {userAuthByCookies} = require('./middlewares/auth');


app.use(cookieParser());
// converting the json from the req body to a js object
app.use(express.json());
app.post('/signup', async (req, res) => {
    console.log(req.body);
    // creating a new instance of the User model
    try {
        const user = new User(req.body);
        const password = user.password;
        console.log(password);
        const encryptedHash = await bcrypt.hash(password, 10)
        user.password = encryptedHash;
        await user.save();
        res.send('User added successfully');
    } catch(e) {
        res.status(400).send('Error saving user' + e.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        console.log(user);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // First param - user entered password
        // Second param - actual encrypted passwrod in database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            // create a jwt token
            const token = await jwt.sign({ _id: user._id }, "DevTinder@512");
            console.log(token);
            res.cookie("token", token);
            res.send('Login successful');
        } else {
            throw new Error('Invalid credentials');
        }
    }
    catch (e) {
        res.status(400).send('Something went wrong ' + e.message);
    }
})

app.get('/profile', userAuthByCookies, async (req, res) => {
    try {
        // const cookies = req.cookies;
        // const { token } = cookies;
        // // validate token
        // const decodeMessage = await jwt.verify(token, "DevTinder@512");
        // const { _id } = decodeMessage;
        // const user = await User.findById(_id);
        const user = req.user;
        console.log(user);
        res.send(user);
    } catch(e) {
        res.status(400).send('Something went wrong');
    }
})

app.get('/sendConnectionRequest', userAuthByCookies, (req, res) => {
    try{
        const user = req.user;
        console.log(user);
        res.send('Sending connection request...');
    } catch(e) {
        res.status(400).send('Something went wrong');
    }
    
})

// delete user by id
app.delete('/user', async (req, res) => {
    try {
        const user = req.body.userId;
        await User.findByIdAndDelete(user);
        res.send('User deleted successfully');
    } catch (e) {
        res.send('Something went wrong');
    }
})

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

// Update a user using patch
app.patch('/user', async (req, res) => {
    console.log(req.body);
    const data = req.body;
    try {
        // API level validations - data sanitization
        const ALLOWED_UPDATES = ['password', 'userId', 'photoUrl', 'gender', 'age', 'skills'];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error('Update not allowed');
        }
        const user = await User.findByIdAndUpdate({ _id: req.body.userId}, req.body, {returnDocument: "after", runValidators: true});
        console.log(user);
        res.send('User updated successfully'); 
    } catch(e) {
        res.status(400).send('Something went wrong..' + e);
    }
})

// Update a user using put
app.put('/user', async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findByIdAndUpdate({ _id: req.body.userId}, req.body);
        console.log(user);
        res.send('User updated successfully'); 
    } catch(e) {
        res.send('Something went wrong..');
    }
})

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