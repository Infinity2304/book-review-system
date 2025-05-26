import mongoose from "mongoose";
import { number } from "zod";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", 
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        minlength: 6,
        maxlength: 100,
    },
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;