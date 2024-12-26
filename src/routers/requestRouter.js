const express = require('express');
const requestRouter = express.Router();
const {userAuthByCookies} = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId', userAuthByCookies, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        console.log(fromUserId, toUserId, status);

        // check if the recepient user exists
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: 'User not found'});
        }

        const allowedStatus = ['ignored', 'interested'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status type ' + status});
        }
        
        // check if connection request already exist
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if(existingConnectionRequest) {
            return res.status(400).json({ message: 'Duplicate connection request' });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });
        const data = await connectionRequest.save(connectionRequest);
        console.log(data);
        res.json(
            { 
                message: req.user.firstName + " " + status + " " + toUser.firstName,
                data
            }
        );
    } catch(e) {
        res.status(400).send(e + e.message);
    }
    
})

requestRouter.post('/request/review/:status/:requestId', userAuthByCookies, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;
    
        // check if status is either accepted or rejected
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(404).json({ message: 'Invalid status provided '});
            // the purpose of return here is that it will not go beyond this line of function
        }
    
        // check if logged in user === toUserId
        // check if existing status of the request is interested only
        // check if request id exists
    
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        if (!connectionRequest) {
            return res.status(404).json({ message: 'Connection request not found'});
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: loggedInUser.firstName + ' ' + status + ' connection request', data });
    } catch (e) {
        res.status(400).send('ERROR' + e.message);
    }
    
})

module.exports = { requestRouter };