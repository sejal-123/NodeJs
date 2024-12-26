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
        }).populate('fromUserId', ['firstName', 'lastName']);
        // this populate gives all the details of the reference table on the basis of the field we pass
        // It can also filter the fields to return like firstName and lastName if we specify it as second param in array
        // But if not specified, it just gives all the available fields from available keys on the basis of that field we provided as a first param 
        res.json({
            message: 'Data fetched successfully',
            data: requests
        });
    } catch(e) {
        res.status(400).send('ERROR: ' + e.message);
    }
});

userRouter.get('/user/connections', userAuthByCookies, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' },
            ]
        })
        .populate('fromUserId', ['firstName', 'lastName'])
        .populate('toUserId', ['firstName', 'lastName']);
        const requests = connectionRequests.map(request => {
            if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return request.toUserId;
            }
            return request.fromUserId;
        });
        res.json({
            data: requests,
            message: 'Data fetched successfully'
        });
    } catch (e) {
        res.status(400).send('ERROR: ' + e.message);
    }
});

module.exports = userRouter;