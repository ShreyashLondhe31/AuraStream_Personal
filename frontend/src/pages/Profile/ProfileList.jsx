import React, { useEffect, useState } from "react";
import { useProfileStore } from "../../store/profile";
import { useAuthStore } from "../../store/authUser";
import { Plus, Trash2, UserRoundCog } from "lucide-react";
import { Link, redirect } from "react-router-dom";
import CreateProfileForm from "./CreateProfileForm";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfileList() {
  const { profiles, fetchProfiles, loading, updateProfile, deleteProfile } =
    useProfileStore();
  const { user, logout, selectProfile, needsProfileSelection } = useAuthStore();
  const [hoveredProfileId, setHoveredProfileId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout().then(() => {
      navigate("/login"); // Navigate to login page after logout
    });
  };

  useEffect(() => {
    console.log("ProfileList useEffect triggered:", {
      needsProfileSelection,
      user,
    });

    if (!needsProfileSelection) {
      console.log("Navigating to home page from ProfileList");
      redirect("/");
      return;
    }

    if (user) {
      fetchProfiles(user._id);
    }
  }, [user, fetchProfiles, navigate, needsProfileSelection]);

  const handleUpdate = (profileId) => {
    updateProfile(profileId, {
      profileName: `Updated ${profileId.slice(0, 5)}`,
    });
    navigate("/profiles");
  };

  const handleDelete = (profileId) => {
    deleteProfile(profileId);
    navigate("/profiles");
  };

  const handleProfileSelect = (profile) => {
    selectProfile(profile);
    navigate("/");
  };

  const handleEditClick = (e, profileId) => {
    e.stopPropagation(); // Prevent profile selection when clicking edit
    navigate(`/editprofile/${profileId}`); // Navigate to your edit profile page
  };

  if (loading)
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
    );

  return (
    <>
      <div className="max-w-full h-screen mx-auto flex text-white bg-black/70 flex-col justify-center items-center">
        <LogOut
          className="size-6 cursor-pointer mr-8 mt-8"
          onClick={handleLogout}
        />
        <h2 className="text-2xl font-bold mb-4 ">Your Profiles</h2>
        <div className="max-w-5xl p-4 mx-auto flex justify-center items-center flex-wrap gap-8 ">
          {profiles.map((profile) => (
            <div key={profile._id} className="relative group">
              <div
                className="w-40 h-40 p-4 bg-black/20 flex flex-col rounded-md justify-center items-center cursor-pointer transition-transform duration-300 group-hover:translate-y-[-5px]"
                onClick={() => handleProfileSelect(profile)}
                onMouseEnter={() => setHoveredProfileId(profile._id)}
                onMouseLeave={() => setHoveredProfileId(null)}
              >
                <div className="w-26 h-32 rounded-full overflow-hidden mb-2">
                  {" "}
                  {/* Container for the image */}
                  <img
                    className="w-full h-full object-cover"
                    src={profile.profileImage}
                    alt={profile.profileName}
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>
                <h2 className="text-sm font-bold truncate text-center pb-1">
                  {profile.profileName}
                </h2>
              </div>
              <div
                className={`absolute bottom-0 left-0 w-full bg-black/50 rounded-b-md flex justify-around items-center transition-all duration-300 ${
                  hoveredProfileId === profile._id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-full"
                }`}
                onMouseEnter={() => setHoveredProfileId(profile._id)}
              >
                <button
                  className="p-2 rounded-md cursor-pointer hover:bg-green-700 transition-colors duration-200"
                  onClick={(e) => handleEditClick(e, profile._id)}
                >
                  <UserRoundCog size={24} />
                </button>
                {/* Removed Delete Button */}
              </div>
            </div>
          ))}

          <div className="w-30 h-30 bg-green-400 flex flex-col rounded-md justify-center items-center transform transition-all duration-400 hover:scale-110 cursor-pointer ">
            <Link
              to={"/createprofile"}
              className="flex justify-center items-center"
            >
              <Plus size={60} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileList;
