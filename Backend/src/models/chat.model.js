import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    isGroupChat: {
        type: Boolean,
        default: false
    },
    chatName: {
        type: String
    }
}, { timestamps: true })

export const Chat = mongoose.model("Chat", chatSchema)