import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmbd.service.js";
import mongoose from "mongoose";

export async function searchPerson(req, res) {
  const { query } = req.params;
  console.log("req.query", req.query);
  const { profileId } = req.query; // Expect profileId in the request body
  if (!profileId) {
    return res
      .status(400)
      .json({ success: false, message: "profileId is required" });
  }
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].profile_path,
          title: response.results[0].name,
          searchType: "person",
          createdAt: new Date(),
          profileId: profileId, // Add profileId
        },
      },
    });

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchPerson controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function searchMovie(req, res) {
  console.log("req.query", req.query);
  const { query } = req.params;
  const { profileId } = req.query; // 
  if (!profileId) {
    return res
      .status(400)
      .json({ success: false, message: "profileId is required" });
  }

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].title,
          searchType: "movie",
          createdAt: new Date(),
          profileId: profileId
        },
      },
    });
    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.error("Error in searchMovie controller:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function searchTv(req, res) {
  const { query } = req.params;
  console.log("req.query", req.query);
  const { profileId } = req.query; // Expect profileId in the request body
  if (!profileId) {
    return res
      .status(400)
      .json({ success: false, message: "profileId is required" });
  }

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].profile_path,
          title: response.results[0].name,
          searchType: "tv",
          createdAt: new Date(),
          profileId: profileId, // Add profileId
        },
      },
    });

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchTv controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getSearchHistory(req, res) {
  console.log("req.query:", req.query); // Log the query parameters
  console.log("req.user._id", req.user._id);

  const { profileId } = req.query;

  if (!profileId) {
      return res.status(400).json({ success: false, message: "profileId is required" });
  }

  try {
      const user = await User.findById(req.user._id);

      if (!user) {
          console.log("User not found");
          return res.status(404).json({ message: "User not found" });
      }

      const profileSearchHistory = user.searchHistory.filter((item) => {
          return item.profileId.toString() === profileId;
      });
      

      res.status(200).json({ success: true, content: profileSearchHistory });
  } catch (error) {
      console.error("Error in getSearchHistory:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeItemFromSearchHistory(req, res) {
  let { id } = req.params;
  console.log("req.query", req.query);
  const { profileId } = req.query; // Expect profileId as query parameter
  if (!profileId) {
    return res
      .status(400)
      .json({ success: false, message: "profileId is required" });
  }

  try {
    const userId = req.user._id;

    const updateResult = await User.updateOne(
        { _id: userId },
        {
            $pull: {
                searchHistory: {
                    id: parseInt(id), // If id is an integer, else remove parseInt
                    profileId: new mongoose.Types.ObjectId(profileId) // If profileId is ObjectId
                }
            }
        }
    );

    if (updateResult.modifiedCount > 0) {
        res.status(200).json({ success: true, message: "Item removed from search history" });
    } else {
        res.status(404).json({ success: false, message: "Item not found in search history" });
    }

} catch (error) {
    console.log("Error in removeItemFromSearchHistory controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
}
}