import { continueWatching } from "../models/continueWatching.model.js";

export const addToContinueWatching = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const {
      mediaId,
      mediaType,
      title,
      backdropPath,
      posterPath,
      currentSeason,
      currentEpisode,
    } = req.body;
   
    const userId = req.user._id;
    const profileId = req.profile._id;

    const existingItem = await continueWatching.findOne({
      userId,
      profileId,
      mediaId,
      mediaType,
    });

    if (existingItem) {
      // If the item exists, update the last watched time
      existingItem.lastWatchedAt = Date.now();
      const updatedItem = await existingItem.save();
      return res.status(200).json(updatedItem);
    }

    const newItem = new continueWatching({
      userId,
      profileId,
      mediaId,
      mediaType,
      title,
      backdropPath,
      posterPath,
      currentSeason,
      currentEpisode,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error adding to continue watching:", error);
    res.status(500).json({
      message: "Could not add to continue watching",
      error: error.message,
    });
  }
};

export const getContinueWatching = async (req, res) => {
  console.log("Request Query:", req.query);
  const { profileId } = req.query;
  const userId = req.user._id;

  if (!profileId) {
    return res.status(400).json({ message: "profileId is required" });
  }

  try {
    const items = await continueWatching
      .find({ userId, profileId })
      .sort({ lastWatchedAt: -1 })
      .limit(20); // Limit the number of items for performance
    res.status(200).json({ continueWatching: items });
  } catch (error) {
    console.error("Error retrieving continue watching list:", error);
    res.status(500).json({
      message: "Could not retrieve continue watching list",
      error: error.message,
    });
  }
};



export const getContinueWatchingItem = async (req, res) => {
  console.log("getContinueWatchingItem function called!");
  try {
    const { mediaId, mediaType } = req.params;
    const userId = req.user._id;
    const profileId = req.profile._id;

    console.log("Fetching continue watching item for:", { mediaId, userId, profileId });
    console.log("Media type: ", mediaType)

    const item = await continueWatching.findOne({ userId, profileId, mediaId });

    console.log("Found item:", item);

    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Continue watching item not found" });
    }
  } catch (error) {
    console.error("Error fetching continue watching item:", error);
    res.status(500).json({ message: "Could not fetch continue watching item", error: error.message });
  }
};

export const updateContinueWatchingProgress = async (req, res) => {
  const { mediaId, mediaType } = req.params;
  const { currentTime, currentSeason, currentEpisode, totalDuration } =
    req.body;
  const userId = req.user._id;
  const profileId = req.profile._id;

  try {
    const updateData = { currentTime, lastWatchedAt: Date.now() };
    if (mediaType === "tv") {
      updateData.currentSeason = currentSeason;
      updateData.currentEpisode = currentEpisode;
    }
    if (totalDuration !== undefined) {
      updateData.totalDuration = totalDuration;
    }

    const updatedItem = await continueWatching.findOneAndUpdate(
      { userId, profileId, mediaId, mediaType },
      updateData,
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ message: "Item not found in continue watching" });
    }

    res
      .status(200)
      .json({ message: "Progress updated successfully", updatedItem });
  } catch (error) {
    console.error("Error updating continue watching progress:", error);
    res
      .status(500)
      .json({ message: "Could not update progress", error: error.message });
  }
};

export const removeFromContinueWatching = async (req, res) => {
  const { mediaId, mediaType } = req.params;
  const { profileId } = req.query;
  const userId = req.user._id;

  if (!profileId) {
    return res.status(400).json({ message: "profileId is required" });
  }

  try {
    const deletedItem = await continueWatching.findOneAndDelete({
      userId,
      profileId,
      mediaId,
      mediaType,
    });
    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Item not found in continue watching" });
    }
    res
      .status(200)
      .json({ message: "Removed from continue watching successfully" });
  } catch (error) {
    console.error("Error removing from continue watching:", error);
    res.status(500).json({
      message: "Could not remove from continue watching",
      error: error.message,
    });
  }
};
