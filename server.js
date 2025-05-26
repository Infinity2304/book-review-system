import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import reviewRoutes from "./routes/review.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // to parse the incoming requests with json payloads
app.use(cookieParser()); // to parse the incoming requests for cookies

app.use('/api/auth',authRoutes);
app.use('/api/book',bookRoutes);
app.use('/api/review',reviewRoutes);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Example app listening on port ${PORT}`);
})