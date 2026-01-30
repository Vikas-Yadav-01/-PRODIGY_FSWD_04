import { Chat } from "../models/chat.model.js"

const accessChat = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const { userId } = req.body
        if (!userId) {
            return res.status(400).json({ message: "UserId is required" })
        }

        let chat = await Chat.findOne({ isGroupChat: false, users: { $all: [user._id, userId] } }).populate("users")
        if (chat) {
            return res.status(200).json({ message: "Chat found", success: true, chat })
        }

        const newChat = await Chat.create({
            users: [user._id, userId]
        })

        const fullChat = await Chat.findById(newChat._id).populate("users")

        return res.status(201).json({ message: "Chat created", success: true, fullChat })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error })
    }
}

const fetchChats = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const chats = await Chat.find({ users: { $in: [user._id] } }).populate("users").sort({ updatedAt: -1 })

        return res.status(200).json({ message: "Chat found", success: true, chats })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error })
    }
}

export {
    accessChat,
    fetchChats
}