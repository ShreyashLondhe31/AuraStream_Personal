import express from "express";
import {
    getSearchHistory,
    removeItemFromSearchHistory,
    searchMovie,
    searchPerson,
    searchTv,
} from "../controllers/search.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); // Apply JWT verification to all routes

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);
router.get("/history", getSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);

export default router;