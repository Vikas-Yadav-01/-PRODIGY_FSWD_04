import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true })

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    )
}

export const User = mongoose.model("User", userSchema)