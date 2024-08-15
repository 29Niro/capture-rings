import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNow } from "date-fns";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-config";

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const bookingsQuery = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const contactQuery = query(
      collection(db, "contactSubmissions"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: "booking",
        ...doc.data(),
      }));
      setNotifications((prev) => {
        const filtered = prev.filter((n) => n.type !== "booking");
        return [...filtered, ...bookingNotifications].sort(
          (a, b) => b.createdAt.toDate() - a.createdAt.toDate()
        );
      });
    });

    const unsubscribeContact = onSnapshot(contactQuery, (snapshot) => {
      const contactNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: "contact",
        ...doc.data(),
      }));
      setNotifications((prev) => {
        const filtered = prev.filter((n) => n.type !== "contact");
        return [...filtered, ...contactNotifications].sort(
          (a, b) => b.createdAt.toDate() - a.createdAt.toDate()
        );
      });
    });

    return () => {
      unsubscribeBookings();
      unsubscribeContact();
    };
  }, []);

  const markAsRead = async (id, type) => {
    const collectionName =
      type === "booking" ? "appointments" : "contactSubmissions";
    const docRef = doc(db, collectionName, id);
    const newStatus = type === "booking" ? "seen" : "read";
    await updateDoc(docRef, { status: newStatus });

    // Update local state immediately
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, status: newStatus }
          : notification
      )
    );
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No new notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`mb-4 p-3 rounded ${
                  notification.status === "pending" ||
                  notification.status === "unread"
                    ? "bg-blue-100"
                    : "bg-gray-100"
                }`}
              >
                {notification.type === "booking" ? (
                  <>
                    <p className="font-semibold">
                      {notification.fname} {notification.lname}
                    </p>
                    <p className="text-sm">{notification.title}</p>
                    <p className="text-sm">
                      Date: {notification.date}, Time: {notification.time}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">{notification.name}</p>
                    <p className="text-sm">{notification.email}</p>
                    <p className="text-sm">
                      {notification.message.substring(0, 50)}...
                    </p>
                  </>
                )}
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(notification.createdAt.toDate())} ago
                </p>
                {(notification.status === "pending" ||
                  notification.status === "unread") && (
                  <button
                    onClick={() =>
                      markAsRead(notification.id, notification.type)
                    }
                    className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Mark as {notification.type === "booking" ? "Seen" : "Read"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
