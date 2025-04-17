import React, { useState } from "react";
import { useProfileStore } from "../../store/profile";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import toast from "react-hot-toast";



function CreateProfileForm() {
  const{createProfile, loading, error} = useProfileStore()
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileName.trim()) {
        toast.error("Please enter a profile name.");
        return;
    }

    try {
        await createProfile({ profileName });
        navigate("/profiles");
    } catch (error) {
        // Handle backend errors
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error(error.message || "Failed to create profile.");
        }
    }
};

  if (loading) return <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer"/>;
  

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
          value={profileImage}
        onChange={(e) => setProfileImage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
        >
          Create profile
        </button>
      </form>
    </div>
  );
}

export default CreateProfileForm;
