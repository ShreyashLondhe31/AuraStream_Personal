import React, { useEffect } from "react";
import { useState } from "react";
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
  const { user, logout, selectProfile } = useAuthStore();
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
      <div className="flex items-center gap-55 z-50">
        <Link to="/">
          <img alt="AuraStream logo" className="w-32 sm:w-40" />
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
          <img
            src="/avatar3.png" // Corrected line
            alt="Profile"
            className="h-8 rounded cursor-pointer"
            onClick={() => setIsProfileListOpen(!isProfileListOpen)}
          />
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

      {/* Profile List */}
      {isProfileListOpen && (
        <div className="absolute top-15 right-20 bg-black border rounded border-gray-800 p-4 z-50">
          <h3 className="text-lg font-semibold mb-2">Profiles</h3>
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-800 rounded"
              onClick={() => handleProfileSelect(profile)}
            >
              <img src={profile.profileImage} alt="" className="h-6 rounded" />
              <span>{profile.profileName}</span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
