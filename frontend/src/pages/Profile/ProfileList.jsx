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

  if (loading)
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
    );

  return (
    <>
      <div className="max-w-full h-screen mx-auto flex text-white bg-black/70 flex-col justify-center items-center">
        <LogOut className="size-6 cursor-pointer" onClick={handleLogout} />
        <h2 className="text-2xl font-bold mb-4 ">Your Profiles</h2>
        <div className="max-w-5xl p-4 mx-auto flex justify-center items-center flex-wrap gap-8 ">
          {profiles.map((profile) => (
            <div key={profile._id} className="relative">
              {" "}
              {/* Added relative positioning */}
              <div
                className="w-40 h-40 p-4 bg-black/20 flex flex-col rounded-md justify-center items-center"
                onMouseEnter={() => setHoveredProfileId(profile._id)}
                onMouseLeave={() => setHoveredProfileId(null)}
                onClick={() => handleProfileSelect(profile)}
              >
                <img
                  className="w-full h-full border rounded-xl mb-3"
                  src={profile.profileImage}
                  alt=""
                />
                <h2 className="text-md font-bold ">{profile.profileName}</h2>
              </div>
              <div
                className={`flex justify-center items-center gap-4 rounded-md w-full h-auto absolute top-1/2 left-0 bg-black/30 transition-all duration-300 ${
                  hoveredProfileId === profile._id
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <button
                  className="rounded-full px-2 py-2 bg-green-400 cursor-pointer"
                  onClick={() => handleUpdate(profile._id)}
                >
                  <UserRoundCog size={30} />
                </button>
                <button
                  className="rounded-full px-2 py-2 bg-red-400 cursor-pointer"
                  onClick={() => handleDelete(profile._id)}
                >
                  <Trash2 size={30} />
                </button>
              </div>
            </div>
          ))}

          <div className="w-30 h-30 bg-green-400 flex flex-col rounded-md justify-center items-center transform transition-all duration-400 hover:scale-110 cursor-pointer ">
            <Link to={"/createprofile"}>
              <Plus size={98} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileList;
