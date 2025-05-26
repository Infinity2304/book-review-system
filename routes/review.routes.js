import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { submitReview, updateReview, deleteReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/books/:id/reviews", protectRoute, submitReview);

router.put("/reviews/:id", protectRoute, updateReview);

router.delete("/reviews/:id", protectRoute, deleteReview);

export default router;