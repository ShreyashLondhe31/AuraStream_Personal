import express from "express";
import {
  createProfile,
  deleteProfile,
  getUserProfiles,
  updateProfile,
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/", verifyJWT , createProfile);
router.get("/:userId",verifyJWT ,  getUserProfiles);
router.put("/:profileId", verifyJWT , updateProfile);
router.delete("/:profileId", verifyJWT , deleteProfile);

export default router