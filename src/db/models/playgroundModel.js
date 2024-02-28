import mongoose, { Types } from 'mongoose';

const playgroundSchema = mongoose.Schema(
    {
        id: Types.ObjectId,
        user: {
            type: Types.ObjectId,
            ref: 'user',
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'UPLOADED', // UPLOADED 올린 상태, ACCEPTED 승인 상태 // REJECTED 거절 상태
        },
    },
    { timestamps: true }
);

const PlayGroundModel = mongoose.model('playground', playgroundSchema);
export default PlayGroundModel;
