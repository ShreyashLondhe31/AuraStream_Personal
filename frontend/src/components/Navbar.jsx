import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Search, LogOut, Menu } from "lucide-react";
import { useContentStore } from "../store/content";
import { useProfileStore } from "../store/profile";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const { user, logout, selectProfile, selectedProfile } = useAuthStore();
  const { setContentType } = useContentStore();
  const { profiles, fetchProfiles } = useProfileStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfiles(user._id);
    }
  }, [user, fetchProfiles]);

  const handleProfileSelect = (profile) => {
    selectProfile(profile);
    setIsProfileListOpen(false); // Close the profile list
    navigate("/");
  };

  return (
    <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
      <div className="flex items-center gap-5 z-50">
        <Link to="/">
          {/* <img alt="AuraStream logo" className="w-32 sm:w-40" /> */}
          <h1 className="text-3xl font-bold" >AuraStream</h1>
        </Link>

        {/* desktop navbar items */}
        <div className="hidden sm:flex gap-10 items-center ">
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("tv")}
          >
            Tv shows
          </Link>
          <Link to="/history" className="hover:underline">
            Search history
          </Link>
        </div>
      </div>

      <div className="flex gap-2 items-center z-50">
        {user?.image && (
          <div className="relative">
            <img
              src="/avatar3.png" // Corrected line
              alt="Profile"
              className="h-8 rounded cursor-pointer"
              onClick={() => setIsProfileListOpen(!isProfileListOpen)}
            />
            {isProfileListOpen && (
              <div className="absolute top-10 right-0 bg-black border rounded border-gray-800 p-4 z-50 w-56"> {/* Adjust width */}
                <h3 className="text-lg font-semibold mb-2">Profiles</h3>
                <div className="flex flex-col gap-2">
                  {profiles.map((profile) => (
                    <div
                      key={profile._id}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
                        selectedProfile?._id === profile._id ? "bg-blue-700" : "hover:bg-gray-800"
                      }`}
                      onClick={() => handleProfileSelect(profile)}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden"> {/* Small image box */}
                        <img
                          src={profile.profileImage}
                          alt={profile.profileName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm truncate">{profile.profileName}</span> {/* Name alongside image */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <Link to={"/search"}>
          <Search className="size-6 cursor-pointer"></Search>
        </Link>

        <LogOut className="size-6 cursor-pointer" onClick={logout} />

        <div className="sm:hidden">
          <Menu className="size-6 cursor-pointer" onClick={toggleMobileMenu} />
        </div>
      </div>

      {/* mobile navbar items */}
      {isMobileMenuOpen && (
        <div className="w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800 ">
          <Link
            to="/"
            className="block hover:underline p-2"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="block hover:underline p-2"
            onClick={() => setContentType("tv")}
          >
            Tv shows
          </Link>
          <Link
            to="/history"
            className="block hover:underline p-2"
            onClick={toggleMobileMenu}
          >
            Search history
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;