import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie} from "../utils/generateToken.js";
import { Profile } from "../models/profile.model.js";




export async function signup(req, res) {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    });

    await newUser.save();
    //  Generate token and set cookie, pass the user ID as part of a payload object
    generateTokenAndSetCookie({ userId: newUser._id.toString() }, res);
    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const defaultProfile = await Profile.findOne({ userId: user._id }); // Consider adding a specific 'isDefault' field to your Profile model for more reliable default profile selection

    const userWithoutPassword = { ...user._doc, password: "" };

    if (defaultProfile) {
      const payload = { userId: user._id.toString(), profileId: defaultProfile._id.toString() };
      generateTokenAndSetCookie(payload, res, "15d"); // Use consistent expiration
      res.status(200).json({
        success: true,
        user: userWithoutPassword,
        profile: defaultProfile, // Optionally send profile info
      });
    } else {
      const payload = { userId: user._id.toString() };
      generateTokenAndSetCookie(payload, res, "15d"); // Use consistent expiration
      res.status(200).json({
        success: true,
        user: userWithoutPassword,
        message: "No profile found, please create one.",
      });
      // Consider a different status code like 206 Partial Content
      // res.status(206).json({ success: true, user: userWithoutPassword, message: "No profile found, please create one." });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
export async function logout(req, res) {
  try {
    res.clearCookie("jwt-aurastream");
    res.clearCookie("jwt-aurastream-profile")
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function authCheck(req, res) {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log("Error in authCheck controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const switchProfile = async (req, res) => {
  try {
    const { profileId } = req.body;
    const userId = req.user._id;

    // Verify that the requested profile belongs to the logged-in user
    const profile = await Profile.findOne({ _id: profileId, userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found for this user" });
    }

    // Generate a new JWT with the updated profileId and set the cookie
    const payload = { userId: userId.toString(), profileId: profile._id.toString() };
    generateTokenAndSetCookie(payload, res, "10d"); // Or your desired expiration

    res.status(200).json({ success: true, message: "Profile switched successfully" });

  } catch (error) {
    console.error("Error switching profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};