import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { createBook, getAllBooks, getSpecBook, searchBook } from '../controllers/book.controller.js';

const router = express.Router();

router.post("/books", protectRoute, createBook);

router.get("/books", protectRoute, getAllBooks);

router.get("/books/:id", protectRoute, getSpecBook);

router.get("/search", protectRoute, searchBook);

export default router;