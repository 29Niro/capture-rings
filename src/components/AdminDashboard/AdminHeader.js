import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path as needed

export const AdminHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const renderAvatar = () => {
    if (user?.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="User Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      );
    } else if (user?.displayName) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
          <span className="text-white text-sm font-medium">
            {getInitials(user.displayName)}
          </span>
        </div>
      );
    } else {
      return <FontAwesomeIcon icon={faUser} className="mr-2" />;
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl">Admin Dashboard</h1>
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center focus:outline-none"
          >
            {renderAvatar()}
            <span>{user?.displayName || user?.email}</span>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
              <div className="px-4 py-2 text-sm text-gray-700">
                Signed in as
                <br />
                <span className="font-medium">
                  {user?.displayName || user?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
