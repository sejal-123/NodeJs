const express = require('express');
const requestRouter = express.Router();
const {userAuthByCookies} = require('../middlewares/auth');

requestRouter.get('/sendConnectionRequest', userAuthByCookies, (req, res) => {
    try{
        const user = req.user;
        console.log(user);
        res.send('Sending connection request...');
    } catch(e) {
        res.status(400).send('Something went wrong');
    }
    
})

module.exports = { requestRouter };