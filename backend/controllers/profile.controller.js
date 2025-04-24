import { ENV_VARS } from "../config/envVars.js";
import { Profile } from "../models/profile.model.js";
import { generateTokenAndSetCookieOnProfileSelection } from "../utils/generateToken.js";
import { v2 as cloudinary } from 'cloudinary'; // Use v2 import



export async function createProfile(req, res) {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  try {
    const { profileName } = req.body;
    const userId = req.user._id;

    if (!profileName) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // **Move the profile count check to be the very first database interaction**
    const profileCount = await Profile.countDocuments({ userId });
    if (profileCount >= 5) {
      return res
        .status(400)
        .json({ message: "User cannot have more than 5 profiles." });
    }

    let profileImageUrl = null;
    if (req.file && req.file.buffer) {
      try {
        // Configuration
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const base64Image = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: 'profile_images',
        });

        profileImageUrl = uploadResult.secure_url;
        console.log("Cloudinary Upload Successful:", uploadResult);

        const profile = new Profile({
          userId,
          profileName,
          profileImage: profileImageUrl,
        });
        await profile.save();
        generateTokenAndSetCookieOnProfileSelection(userId.toString(), profile._id.toString(), res);
        return res.status(201).json({
          success: true,
          message: "Profile created successfully",
          profile: {
            ...profile._doc,
          },
        });

      } catch (cloudinaryError) {
        console.error("Cloudinary Upload Error:", cloudinaryError);
        return res.status(500).json({ success: false, message: "Error uploading image to Cloudinary." });
      }
    } else {
      const profile = new Profile({
        userId,
        profileName,
        profileImage: profileImageUrl, // Will be null if no image
      });
      await profile.save();
      generateTokenAndSetCookieOnProfileSelection(userId.toString(), profile._id.toString(), res);
      return res.status(201).json({
        success: true,
        message: "Profile created successfully",
        profile: {
          ...profile._doc,
        },
      });
    }
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getUserProfiles(req, res) {
  try {
    const userId = req.params.userId; // Get userId from the URL parameter

    // Check if the requested userId matches the authenticated user's ID
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You can only access your own profiles",
      });
    }

    const profiles = await Profile.find({ userId });

    res.status(200).json({
      success: true,
      profiles,
    });
  } catch (error) {
    console.error("Error getting user profiles:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Authorization check (optional, but highly recommended)
    // If you want to ensure only the user associated with the profile can access it:
    if (req.user && req.user._id && profile.user && profile.user.toString()) {
        if (req.user._id.toString() !== profile.user.toString()) {
          return res.status(403).json({ success: false, message: "Unauthorized - You do not have permission to access this profile" });
        }
    } else {
        console.warn("Missing user or profile information for authorization check.");
        // Consider logging or handling this case appropriately.  You might still want to allow access if you can't verify.
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching profile by ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export async function updateProfile(req, res) {
  try {
    const { profileName } = req.body;
    const profileId = req.params.profileId;

    // Find the profile to be updated
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Check if the profile belongs to the authenticated user
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden - You can only update your own profiles" });
    }

    // Update the profile name
    profile.profileName = profileName || profile.profileName;

    // Handle image update if a new file was uploaded
    if (req.file && req.file.buffer) {
      try {
        const base64Image = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

        const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: 'profile_images' });
        profile.profileImage = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary Upload Error:", cloudinaryError);
        return res.status(500).json({ success: false, message: "Error uploading image to Cloudinary." });
      }
    }

    profile.updatedAt = Date.now();
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profiles: profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteProfile(req, res) {
  try {
    const profileId = req.params.profileId;

    // Find the profile to be deleted
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Check if the profile belongs to the authenticated user
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You can only delete your own profiles",
      });
    }

    // Delete the profile
    await Profile.findByIdAndDelete(profileId);

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
