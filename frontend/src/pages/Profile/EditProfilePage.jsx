import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProfileStore } from "../../store/profile";
import { ArrowBigLeft, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

function EditProfilePage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { profiles, loading } =
    useProfileStore();
  const [profileName, setProfileName] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (profileId) {
        // If profiles are already loaded in the store, find the current one
        if (profiles.length > 0) {
          const profile = profiles.find((p) => p._id === profileId);
          if (profile) {
            setCurrentProfile(profile);
            setProfileName(profile.profileName);
          } else {
            // If not in store, fetch it specifically using the new route and with credentials
            try {
              const response = await axios.get(
                `/api/v1/profile/single/${profileId}`,
                {
                  withCredentials: true, // Add this line
                }
              );
              if (response.data.success && response.data.profile) {
                setCurrentProfile(response.data.profile);
                setProfileName(response.data.profile.profileName);
              } else {
                toast.error("Profile not found.");
                // DO NOT navigate("/profiles") here
              }
            } catch (error) {
              toast.error("Error fetching profile.");
              // DO NOT navigate("/profiles") here
            }
          }
        } else {
          // If no profiles in store, fetch the specific one using the new route and with credentials
          try {
            const response = await axios.get(
              `/api/v1/profile/single/${profileId}`,
              {
                withCredentials: true, // Add this line
              }
            );
            if (response.data.success && response.data.profile) {
              setCurrentProfile(response.data.profile);
              setProfileName(response.data.profile.profileName);
            } else {
              toast.error("Profile not found.");
              // DO NOT navigate("/profiles") here
            }
          } catch (error) {
            toast.error("Error fetching profile.");
            // DO NOT navigate("/profiles") here
          }
        }
      } else {
        toast.error("Invalid profile ID.");
        navigate("/profiles");
      }
    };

    fetchCurrentProfile();
  }, [profileId, profiles, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentProfile || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("profileName", profileName);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      await axios.put(`/api/v1/profile/${currentProfile._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Include your authorization token if needed
        },
      });

      toast.success("Profile updated successfully!");
      navigate("/profiles");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!currentProfile) return;
    try {
      await axios.delete(`/api/v1/profile/${currentProfile._id}`);
      toast.success("Profile deleted successfully!");
      navigate("/profiles");
    } catch (error) {
      toast.error(error.message || "Failed to delete profile.");
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  useEffect(() => {
    console.log("showDeleteConfirmation in useEffect:", showDeleteConfirmation);
  }, [showDeleteConfirmation]);

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  if (loading || !currentProfile) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer" />
    );
  }

  return (
    <div className="relative max-w-full h-screen mx-auto bg-black/70 flex justify-center items-center">
      {showDeleteConfirmation && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 opacity-${
            showDeleteConfirmation ? "100" : "0"
          } transition-opacity duration-300 ease-in-out`}
          style={{
            backdropFilter: showDeleteConfirmation ? "blur(8px)" : "blur(0px)",
            transition: "backdrop-filter 0.3s ease-in-out", // Add transition for backdropFilter
          }}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 flex flex-col gap-4"
      >
        <h2 className="text-3xl font-bold mb-6 text-white">Edit Profile</h2>

        <label
          htmlFor="profileName"
          className="text-lg font-semibold text-white"
        >
          Profile Name
        </label>
        <input
          type="text"
          id="profileName"
          className="px-4 py-2 border-2 border-zinc-800 rounded-md bg-black/50 text-white"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />

        <label
          htmlFor="profileImage"
          className="text-lg font-semibold text-white"
        >
          Update Image (Optional)
        </label>
        <input
          type="file"
          id="profileImage"
          className="px-4 py-2 border-2 border-zinc-800 rounded-md bg-black/50 text-white"
          onChange={handleImageChange}
        />
        {currentProfile.profileImage && (
          <div className="mt-2">
            <p className="text-sm text-gray-400">Current Image:</p>
            <img
              src={currentProfile.profileImage}
              alt="Current Profile"
              className="w-24 h-24 rounded-md object-cover"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition-colors duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </button>

        <div className="flex justify-between items-center mt-4">
          <Link
            to="/profiles"
            className="text-blue-500 hover:underline flex items-center"
          >
            <ArrowBigLeft className="mr-2" size={20} />
            Back to Profiles
          </Link>
          <button
            type="button"
            className="text-red-500 hover:text-red-600 cursor-pointer flex items-center"
            onClick={handleDeleteClick}
          >
            <Trash2 className="mr-2" size={20} />
            Delete Profile
          </button>
        </div>
      </form>

      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white rounded-md p-6 z-50 shadow-lg 
     
    ${showDeleteConfirmation ? "opacity-100 scale-100" : "opacity-0"}`}
        style={{
          pointerEvents: showDeleteConfirmation ? "auto" : "none",
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete this profile?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={cancelDelete}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Delete
          </button>
        </div>
        <button
          onClick={cancelDelete}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default EditProfilePage;
