import express from "express";
import { config } from "dotenv";
//import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

//middlewares
app.use(cors({ origin: "https://mern-ai-chatbot-frontend-n7lp.onrender.com", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
//app.use(morgan("dev"));

app.use("/", appRouter);

export default app;
