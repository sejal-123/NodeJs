const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect('mongodb+srv://sejal:test@nodejs.mgakq.mongodb.net/DevTinder');
};

module.exports = connectDB;


