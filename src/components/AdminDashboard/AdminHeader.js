import {
  faBell,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase-config";
import { NotificationDrawer } from "./NotificationDrawer";

export const AdminHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const bookingsQuery = query(
      collection(db, "appointments"),
      where("status", "in", ["pending", "seen"])
    );
    const contactQuery = query(
      collection(db, "contactSubmissions"),
      where("status", "==", "unread")
    );

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const pendingBookings = snapshot.docs.filter(
        (doc) => doc.data().status === "pending"
      ).length;
      setUnreadCount((prev) => prev - prev + pendingBookings);
    });

    const unsubscribeContact = onSnapshot(contactQuery, (snapshot) => {
      setUnreadCount((prev) => prev + snapshot.size);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeContact();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/admin/signin");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleNotificationRead = () => {
    setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
  };

  return (
    <>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl">Admin Dashboard</h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <FontAwesomeIcon
                icon={faBell}
                className="text-xl cursor-pointer"
                onClick={() => setIsDrawerOpen(true)}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center focus:outline-none"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                <span>{user?.email}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Signed in as
                    <br />
                    <span className="font-medium">{user?.email}</span>
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
        </div>
      </header>
      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNotificationRead={handleNotificationRead}
      />
    </>
  );
};
