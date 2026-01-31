import { Message } from "../models/message.model.js"
import { Chat } from "../models/chat.model.js"

const sendMessage = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const { content, chatId } = req.body
        if (!content || !chatId) {
            return res.status(400).json({ message: "Content and chatId required" })
        }

        let message = await Message.create({
            sender: user._id,
            content,
            chat: chatId
        })

        message = await message.populate("sender", "userName phoneNumber")
        message = await message.populate({
            path: "chat",
            populate: {
                path: "users",
                select: "userName phoneNumber"
            }
        })

        await Chat.findByIdAndUpdate(chatId, {
            updatedAt: Date.now()
        })

        return res.status(201).json({ message: "Message sent", success: true })
    } catch (error) {
        return res.status(500).json({ message: "Failed to send message", error })
    }
}

const fetchMessages = async (req, res) => {
    try {
        const { chatId } = req.params

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "userName phoneNumber")
            .populate("chat")

        return res.status(200).json({ message: "Message found", success: true, messages })
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch messages", error })
    }
}

export {
    sendMessage,
    fetchMessages
}