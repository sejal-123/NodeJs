const express = require('express');
const profileRouter = express.Router();
const {userAuthByCookies} = require('../middlewares/auth');
const bcrypt = require('bcrypt');

profileRouter.get('/profile/view', userAuthByCookies, async (req, res) => {
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
        res.status(400).send('Something went wrong' + e.message);
    }
})

profileRouter.patch('/profile/edit', userAuthByCookies, async (req, res) => {
    try {
        const allowedModifications = ['firstName', 'lastName', 'photoUrl', 'skills'];
        Object.keys(req.body).forEach(key => {
            if (!allowedModifications.includes(key)) {
                throw new Error('Edit not allowed');
            }
        });
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.json({ message: `${loggedInUser.firstName} is updated successfully`,
        data: loggedInUser});
    } catch(e) {
        res.status(400).send('Something went wrong' + e.message);
    }
})

profileRouter.patch('/profile/password', userAuthByCookies, async (req, res) => {
    try {
        console.log(req.user);
        const pass = req.body.password;
        if (pass) {
            const allowedModifications = ['password'];
            Object.keys(req.body).forEach(key => {
                if (!allowedModifications.includes(key)) {
                    throw new Error('Edit not allowed');
                }
            });
            const loggedInUser = req.user;
            const isSamePassword = await loggedInUser.validatePassword(req.body.password);
            console.log(isSamePassword);
            if (isSamePassword) {
                throw new Error('Old and new password cannot be same');
            }
            loggedInUser.password = await bcrypt.hash(req.body.password, 10);
            await loggedInUser.save();
            res.send('Password updated successfully');
        } else {
            throw new Error('Please provide password');
        }
    } catch(e) {
        res.status(400).send('Something went wrong ' + e.message);
    }

})

module.exports = { profileRouter };