const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(email) {
            if(!validator.isEmail(email)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        validate(pass) {
            if(!validator.isStrongPassword(pass)) {
                throw new Error('Weak password');
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate: (data) => {
            if(!['Male', 'Female', 'Other'].includes(data)) {
                throw new Error('Invalid gender data...');
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.citypng.com%2Fphoto%2F19313%2Fdownload-black-male-user-profile-icon-png&psig=AOvVaw0AoYftwrNM-Q_nH49wc4cu&ust=1731395714235000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJD9u-bd04kDFQAAAAAdAAAAABAJ",
        validate(photo) {
            if(!validator.isURL(photo)) {
                throw new Error('Invalid photo URL');
            }
        }
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });


// Get individual user token
userSchema.methods.getJwt = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'DevTinder@512', { expiresIn: "7d"});
    return token;
}

// validate individual user password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

// const User = mongoose.model('User', userSchema);
module.exports = mongoose.model("User", userSchema);