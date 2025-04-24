import express from "express";
import {
    addToContinueWatching,
    getContinueWatching,
    updateContinueWatchingProgress,
    removeFromContinueWatching,
    getContinueWatchingItem
} from "../controllers/continueWatching.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", addToContinueWatching);
router.get("/", getContinueWatching);
router.get("/:mediaId/:mediaType", verifyJWT, getContinueWatchingItem);
router.put("/:mediaId/:mediaType", updateContinueWatchingProgress);
router.delete("/:mediaId/:mediaType", removeFromContinueWatching);

export default router;