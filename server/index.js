import dotenv from "dotenv";
dotenv.config();

import http from "http";
import express from "express";
import Router from "./routes.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(Router);

// mongo connection
const MONGO_URL = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@cluster0.xxutl.mongodb.net/cc?retryWrites=true&w=majority`;
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
}).then(() => {
    console.log("connection: success");
}).catch(err => console.log(err));

// listen
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log("Listening to PORT: " + PORT));