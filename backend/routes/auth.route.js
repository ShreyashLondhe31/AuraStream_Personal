import express from "express";
import { authCheck, login, logout, signup, switchProfile } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post('/switchprofile', verifyJWT, switchProfile)

router.get("/authCheck", verifyJWT , authCheck);

export default router;

