const express = require('express');
const { userAuthByCookies } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

userRouter.get('/user/requests/received', userAuthByCookies, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        res.json({
            message: 'Data fetched successfully',
            data: requests
        });
    } catch(e) {
        res.status(400).send('ERROR: ' + e.message);
    }
})

module.exports = userRouter;