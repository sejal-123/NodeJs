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

module.exports = {
    adminAuth,
    userAuth
}