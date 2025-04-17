import { Profile } from "../models/profile.model.js";
import { generateTokenAndSetCookieOnProfileSelection } from "../utils/generateToken.js";



export async function createProfile(req, res) {
  try {
    const { profileName, profileImage } = req.body;
    const userId = req.user._id; // Get userId from protectedRoute middleware

    if(!profileName){
      return res.status(400).json({success:false, message:"Invalid credentials"})
    }

    // Check if user has 5 profiles already
    const profileCount = await Profile.countDocuments({ userId });
    if (profileCount >= 5) {
      return res
        .status(400)
        .json({ message: "User cannot have more than 5 profiles." });
    }

   
    const profile = new Profile({
      userId,
      profileName,
      profileImage,
    });
    await profile.save()
    generateTokenAndSetCookieOnProfileSelection(userId.toString(), profile._id.toString(), res); // corrected line
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: {
        ...profile._doc
      },
    });
    
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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

export async function updateProfile(req, res) {
  try {
    const { profileName, profileImage } = req.body;
    const profileId = req.params.profileId;

    // Find the profile to be updated
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
        message: "Forbidden - You can only update your own profiles",
      });
    }

    // Update the profile
    profile.profileName = profileName || profile.profileName;
    profile.profileImage = profileImage || profile.profileImage;
    profile.updatedAt = Date.now();

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profiles:profile,
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
