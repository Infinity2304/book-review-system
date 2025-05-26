import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6,
        maxlength: 18,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;