import express from "express";
import cors from 'cors';

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import profileRoutes from "./routes/profile.route.js"

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middlewares/auth.middleware.js";


const app = express();
const PORT = ENV_VARS.PORT;

app.use(express.json()); // will allow us to parse req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", verifyJWT ,profileRoutes);
app.use("/api/v1/movie", verifyJWT, movieRoutes);
app.use("/api/v1/tv", verifyJWT, tvRoutes);
app.use("/api/v1/search", verifyJWT, searchRoutes);
app.use(cors());

app.listen(PORT, () => {
  console.log("Server is running at localhost: " + PORT);
  connectDB();
});
