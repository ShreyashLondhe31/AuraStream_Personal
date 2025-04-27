// auth.middleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";
import { Profile } from "../models/profile.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-aurastream"];

        if (!token) {
            console.log("No user token")
            return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
        }

        try {
            const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                console.log('No user')
                return res.status(404).json({ success: false, message: "User not found" });
            }
            req.user = user;

            if (decoded.profileId) {
                const profile = await Profile.findById(decoded.profileId); // First (and only needed) query
                if (!profile) {
                    console.log("No profile");
                    return res.status(404).json({ success: false, message: "Profile not found" });
                }
                req.profile = profile;
            } else {
                req.profile = null; // Or handle the case where there's no profileId in the token
            }
            console.log("Decoded JWT in continueWatching routes:", decoded);
            console.log("req.user in continueWatching routes:", req.user);
            console.log("req.profile in continueWatching routes:", req.profile);
            next();
        } catch (jwtError) {
            if (jwtError instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ success: false, message: "Unauthorized - Token expired" });
            } else if (jwtError instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
            } else {
                return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
            }
        }
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};