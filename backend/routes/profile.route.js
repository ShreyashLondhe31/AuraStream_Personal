import express from "express";
import {
  createProfile,
  deleteProfile,
  getUserProfiles,
  updateProfile,
  getProfileById
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js"




const router = express.Router();

router.post("/", verifyJWT ,upload.single('profileImage'), createProfile);
router.get("/single/:profileId", verifyJWT, getProfileById);
router.get("/:userId",verifyJWT ,  getUserProfiles);
router.put("/:profileId", verifyJWT, upload.single('profileImage')  , updateProfile);
router.delete("/:profileId", verifyJWT , deleteProfile);

export default router