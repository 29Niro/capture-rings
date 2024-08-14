import {
  faBlog,
  faBoxes,
  faCalendarAlt,
  faImages,
  faShoppingCart,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ className = "" }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/teams", icon: faUsers, text: "Teams" },
    { path: "/admin/packages", icon: faBoxes, text: "Packages" },
    { path: "/admin/bookings", icon: faCalendarAlt, text: "Booking Details" },
    { path: "/admin/blog-management", icon: faBlog, text: "Blog Management" },
    {
      path: "/admin/event-gallery-management",
      icon: faImages,
      text: "Event Gallery Management",
    },
    {
      path: "/admin/product-management",
      icon: faShoppingCart,
      text: "Product Management",
    },
  ];

  return (
    <aside className={`w-64 bg-gray-900 text-white ${className}`}>
      <nav className="p-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3" />
                <span className="text-lg">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
