const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminAuth = (req, res, next) => {
    console.log('Authenticating admin from function...');
    const token = 'xyz';
    if (token === 'xyz') {
        next();
    } else {
        res.status(401).send('Unauthorized user');
    }
};

const userAuth = (req, res, next) => {
    console.log('Authenticating user from function...');
    const token = 'aaa';
    if (token === 'aaa') {
        next();
    } else {
        res.status(401).send('Unauthorized user');
    }
};

const userAuthByCookies = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        const decodedMessage = jwt.verify(token, 'DevTinder@512');
        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        req.user = user;
        next();
    } catch(e) {
        res.status(400).send('Something went wrong');
    }
}

module.exports = {
    adminAuth,
    userAuth,
    userAuthByCookies
}