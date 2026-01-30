import { User } from "../models/user.model.js";

const signup = async (req, res) => {
    try {
        const { userName, phoneNumber } = req.body
        if (!userName || !phoneNumber) {
            return res.status(400).json({ message: "Both fields are required" })
        }

        const existedUser = await User.findOne({ phoneNumber })
        if (existedUser) {
            return res.status(400).json({ message: "User already exist" })
        }

        const user = await User.create({
            userName,
            phoneNumber
        })

        const token = await user.generateToken()

        return res
            .status(201)
            .cookie("token", token)
            .json({ message: "User created sucessfully", success: true, user, token })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error })
    }
}

const login = async (req, res) => {
    try {
        const { phoneNumber } = req.body
        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" })
        }

        const user = await User.findOne({ phoneNumber })
        if (!user) {
            return res.status(401).json({ message: "User does not exist" })
        }

        const token = await user.generateToken()

        return res
            .status(200)
            .cookie("token", token)
            .json({ message: "User logged In", success: true, user, token })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error })
    }
}

const fetchUser = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ message: "User found", success: true, user })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error })
    }
}

const logout = async (req, res) => {
    try {
        return res
            .status(200)
            .clearCookie("token")
            .json({ success: true, message: "User logged out successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Logout failed", error })
    }
}

export {
    signup,
    login,
    fetchUser,
    logout
}