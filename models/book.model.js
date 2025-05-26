import mongoose, { model } from "mongoose";
import User from "./user.model.js";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        maxlength: 18, 
    },
    author: {
        type: String,
        required: true,
        maxlength: 18,
    },
    genre: {
        type: String,
        required: true,
        maxlength: 18,
    },  

}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

export default Book;