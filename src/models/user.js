const mongoose = require('mongoose');

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
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate: (data) => {
            if(!['male', 'female', 'others'].includes(data)) {
                throw new Error('Invalid gender data...');
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.citypng.com%2Fphoto%2F19313%2Fdownload-black-male-user-profile-icon-png&psig=AOvVaw0AoYftwrNM-Q_nH49wc4cu&ust=1731395714235000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJD9u-bd04kDFQAAAAAdAAAAABAJ"
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

// const User = mongoose.model('User', userSchema);
module.exports = mongoose.model("User", userSchema);