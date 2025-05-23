import React, { useState } from "react";
import { useProfileStore } from "../../store/profile";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import toast from "react-hot-toast";
import axios from "axios"; // Import axios
import { ArrowBigLeft } from "lucide-react";



function CreateProfileForm() {
  const { createProfile, loading, error } = useProfileStore();
  const [profileName, setProfileName] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!profileName.trim()) {
      toast.error("Please enter a profile name.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("profileName", profileName); // Append profileName to FormData
  
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }
  
      const response = await axios.post(
        "/api/v1/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Include your authorization token if needed
          },
        }
      );
  
      toast.success(response.data.message);
      navigate("/profiles");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Failed to create profile.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
    );

  return (
    <div className="max-w-full h-screen mx-auto bg-black/70 flex justify-center items-center ">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 flex flex-col gap-2"
      >
        <label htmlFor="profileName" className="text-2xl font-semibold">
          Profile name
        </label>
        <input
          type="text"
          placeholder=""
          className="px-5 py-2 border-2 border-zinc-800 rounded-md mb-3"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
        <label htmlFor="profileImage" className="text-2xl font-semibold">
          Upload image
        </label>
        <input
          type="file"
          className="px-5 py-2 border-2 border-zinc-800 rounded-md mb-3"
          onChange={handleImageChange}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:scale-110 duration-300 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            "Create Profile"
          )}
        </button>
        <div className="text-center mt-2">
          <Link to="/profiles" className="text-white flex items-center justify-center bg-blue-500 py-2 rounded-md hover:scale-110 duration-300 font-bold">
            <ArrowBigLeft className="mr-2" size={20} /> {/* Add the icon here */}
            Back to profiles
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateProfileForm;
