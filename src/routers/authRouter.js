const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

authRouter.post('/signup', async (req, res) => {
    console.log(req.body);
    // creating a new instance of the User model
    try {
        const user = new User(req.body);
        const password = user.password;
        console.log(password);
        const encryptedHash = await bcrypt.hash(password, 10)
        user.password = encryptedHash;
        const data = await user.save();
        res.json({
            message: 'User added successfully',
            data 
        });
    } catch(e) {
        res.status(400).send('Error: ' + e.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // First param - user entered password
        // Second param - actual encrypted passwrod in database
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // create a jwt token
            const token = await user.getJwt();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            const result = {
                token,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                gender: user.gender,
                photoUrl: user.photoUrl,
                age: user.age,
                skills: user.skills,
            }
            res.json({
                message: 'Login successful',
                data: result
            });
        } else {
            throw new Error('Invalid credentials');
        }
    }
    catch (e) {
        res.status(401).send('Something went wrong ' + e.message);
    }
});

authRouter.post('/logout', (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    });
    res.json({
        message: 'Logged out successfully',
        data: null
    });
});

module.exports = { authRouter };