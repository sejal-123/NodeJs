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

module.exports = { requestRouter };