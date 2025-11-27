import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const lim = "16kb"

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }
));

app.use(express.json(
    { limit: lim, }
));

app.use(express.urlencoded(
    { extended: true, limit: lim, }
));

app.use(express.static("public"));

app.use(cookieParser());


export { app };