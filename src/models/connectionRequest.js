const mongoose = require('mongoose');

const connectRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'accepted', 'interested', 'rejected'],
            message: `{VALUE} is incorrect status type`
        }
    }
}, { timestamps: true });

connectRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectRequestSchema.pre('save', function () {
    // check if fromUserId is not same as toUserId 
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('Request cannot be sent to yourself');
    }
})

const connectionRequestModel = new mongoose.model("connectionRequest", connectRequestSchema);
module.exports = connectionRequestModel;