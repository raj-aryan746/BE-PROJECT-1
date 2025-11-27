// require("dotenv").config({path: "./env"});
import dotenv from "dotenv";
import conncetDB from "./database/connecte.database.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env",
});

conncetDB()
.then(() => {
    const connectionPort = process.env.PORT || 8000;
  
    app.on("error", (error) => {
        console.log("ERROR :",error);
        throw error
    });

    app.listen(connectionPort, () => {
        console.log(`\n server is running at port : ${connectionPort}`);
    });
})
.catch((err) => {
    console.log("mongoDB connection failed !!", err);
});






































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