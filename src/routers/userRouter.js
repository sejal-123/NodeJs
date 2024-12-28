const express = require('express');
const { userAuthByCookies } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();
const User = require('../models/user');

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

userRouter.get('/user/feed', userAuthByCookies, async (req, res) => {
    try {
        // User should see other users on his feed except
        // 1. he himself
        // 2. his connections
        // 3. blocked or ignored users
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId');
        // }).select('fromUserId toUserId').populate('fromUserId', ['firstName', 'lastName']).populate('toUserId', ['firstName', 'lastName']); - just to show population
        // select function is user for returning only those fields provided in array
        // If we add - sign at front, then it will show all other fields excluding specified ones with - sign
        const hideUsersFromUser = new Set();
        connectionRequests.forEach(connection => {
            hideUsersFromUser.add(connection.fromUserId.toString());
            hideUsersFromUser.add(connection.toUserId.toString());
        });
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromUser) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select('firstName lastName').skip(skip).limit(limit);
        // We can also implement pagination here which is given by default from mongo db
        // we need to pass skip and limit method params
        // /user/feed?page=1&limit=10
        // skip = 0 and limit 10 (page 1).. 1 - 10
        // skip = 10 and limit 10 (page 2).. 11 - 20
        // skip = 20 and limit 10 (page 3).. 21 - 30
        //  So the formula for skip becomes (page - 1) * limit
        res.json({
            message: 'Data fetched successfully',
            data: users
        });
    } catch(e) {
        res.status(400).json({
            message: 'ERROR: ' + e.message
        });
    }
    
})

module.exports = userRouter;