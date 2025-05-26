import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import Review from "../models/review.model.js";

export const createBook = async (req, res) => {
    try {
        const {title, author, genre} = req.body;

        const book = Book.findOne(title);

        if (book){
            res.status(400).json({error: "Book with this title already exists "})
        }

        const newBook = new Book({
            title,
            author,
            genre,
        })

        if(newBook){
            await newBook.save();
            res.status(201).json({message: "Book Saved !"});
        } else {
            res.status(400).json({ error: "Invalid book data"})
        }

    } catch (error) {
        console.log("Error in createBook controller ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllBooks = async (req, res) => {
    try{
        const {author, genre, page, limit} = req.query;
        let query = {}; 
        
        if (genre){
            query.genre = { $regex:genre, $options: 'i' };
        }
        if (author){
            query.author = { $regex:author, $options: 'i' };
        }

        // --- Pagination Logic ---
        const pageNumber = parseInt(page) || 1; // Default to page 1 if pagenumber not given
        const limitNumber = parseInt(limit) || 10; // Default to 10 items per page
        const skip = (pageNumber - 1) * limitNumber; // Calculate the number of documents to skip

        const totalBooks = await Book.countDocuments(query);

        const books = await Book.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ title: 1 });

        const totalPages = Math.ceil(totalBooks / limitNumber);

        res.status(200).json({
            data: books,
            pagination: {
                totalBooks,
                currentPage: pageNumber,
                limit: limitNumber,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            }
        });

    } catch (error){
        console.log('Error in getAllBook controller ',error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}

export const getSpecBook = async (req, res) => {
    try{
        const bookId = req.params.id;

        const book = await Book.findById(bookId);

        if(!book){
            return res.status(404).json({ message: 'Book not found' });
        }

        const reviews = await Review.find({book:bookId}).populate('user','username').sort({createdAt: -1});

        const bookReviews = {
            book: book,
            reviews: reviews,
        };
        res.status(200).json(bookReviews);
    } catch (error){
        console.log('Error in getSpecBook controller ', error.message);
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Book ID format' });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}

export const searchBook = async (req, res) => {
    try {
        const { q } = req.query; // Using 'q' as a search query parameter name

        if (!q) {
            return res.status(400).json({ message: 'Search term is required.' });
        }

        // Build the $or query for title or author search
        const query = {
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } }
            ]
        };


        const books = await Book.find(query).sort({ title: 1 });

        res.json(books);

    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}