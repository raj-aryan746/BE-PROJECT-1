// require("dotenv").config({path: "./env"});
import dotenv from "dotenv";
import conncetDB from "./database/connecte.database.js";

dotenv.config({
    path: "./env",
});

conncetDB();






































/*
import express from "express";

const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        app.on("Error", (error)=>{
            console.log("ERROR", error);
            throw error;
        });
        
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port : ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("ERROR :", error);
        throw error;
    };
})();
*/