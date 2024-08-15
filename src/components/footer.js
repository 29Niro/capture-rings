/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-300 py-8">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-700">
        <div>
          <h4 className="font-semibold text-lg">Capture Rings</h4>
          <p className="mt-4">
            Capture Rings where love meets the lens. Exceptional wedding
            photography, preserving timeless moments of your special day.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg">Booking</h4>
          <ul className="mt-4">
            <li className="mt-2">
              <Link to="/booking" className="hover:underline">
                Book an Appointment
              </Link>
            </li>
            <li className="mt-2">
              <Link to="" className="hover:underline">
                My Bookings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">Other Menu</h4>
          <ul className="mt-4">
            <li className="mt-2">
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="mt-2">
              <Link to="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li className="mt-2">
              <Link to="contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li className="mt-2">
              <Link to="about" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">Newsletter</h4>
          <p className="mt-4">Get 20% off for your first newsletter</p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-2 w-full border rounded-l-3xl focus:outline-none"
            />
            <button className="px-4 py-2 bg-gray-800 text-white rounded-r-3xl hover:bg-gray-700">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
      <div className="border-t mt-8 py-4">
        <p className="text-center text-sm text-gray-600">
          Copyright © 2024 Capture Rings | Made by NIRO
        </p>
      </div>
    </footer>
  );
};
