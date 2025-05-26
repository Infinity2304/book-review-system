import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import Review from "../models/review.model.js";
import mongoose from 'mongoose';

export const submitReview = async (req, res) => {
    try {
        const {rating, comment} = req.body;
        const bookId = req.params.id;
        const userId = req.user ? req.user._id : req.userId;

        // Validations
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid Book ID format.' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating is required and must be between 1 and 5.' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' }); 
        }

        // Check for existing review
        const existingReview = await Review.findOne({ book: bookId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already submitted a review for this book.' });
        }

        const newReview = new Review({
            book: bookId,
            user: userId,
            rating,
            comment,
        });

        await newReview.save();

        res.status(201).json({ message: 'Review submitted successfully!'});

    } catch (error){
        console.error('Error in createReview controller: ', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation error", errors: errors });
        }
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid ID format in request.' });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { rating, comment } = req.body; 

        const userId = req.user ? req.user._id : req.userId;

        // Validations
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: 'Invalid Review ID format.' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const reviewToUpdate = await Review.findById(reviewId);

        if (!reviewToUpdate) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // To ensure that the review is given by the same user or not 
        if (!reviewToUpdate.user.equals(userId)) {
            return res.status(403).json({ message: 'You are not authorized to update this review.' });
        }

        // Update
        if (rating !== undefined) {
            reviewToUpdate.rating = rating;
        }
        if (comment !== undefined) {
            reviewToUpdate.comment = comment;
        }

        await reviewToUpdate.save();

        res.status(200).json({ message: 'Review updated successfully!', review: reviewToUpdate });

    } catch (error) {
        console.error('Error in updateReview controller: ', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation error", errors: errors });
        }
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid ID format in request.' });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const deleteReview = async (req, res) => {
    try {

        const reviewId = req.params.id;
        const userId = req.user ? req.user._id : req.userId;

        // Validation
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: 'Invalid Review ID format.' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        const reviewToDelete = await Review.findById(reviewId);

        if (!reviewToDelete) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // To ensure that the review is given by the same user or not 
        if (!reviewToDelete.user.equals(userId)) {
            return res.status(403).json({ message: 'You are not authorized to delete this review.' });
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({ message: 'Review deleted successfully!' });

    } catch (error) {
        console.error('Error in deleteReview controller: ', error.message);

        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid ID format in request.' });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
};
