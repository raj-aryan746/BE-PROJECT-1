import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser" 

const app = express();

const limitation = "16kb"

app.use( cookieParser() )

app.use(cors({
    origin: process.env.CORS_ORIGIN, // 1
    credentials: true,
}));

app.use(express.json({ 
    limit: limitation,          // 2
}));

app.use(express.urlencoded({ 
    extended: true,              // 3
    limit: limitation, 
}));

app.use(express.static("public"));  // 4



// routes 

import userRouter from "./routes/user.route.js";

// routes declaration

app.use("/api/v1/users", userRouter)


export { app };

