import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CartIcon } from "./Shop/CartIcon";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative bg-gray-300 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">
              Capture Rings
            </h1>
          </a>
        </div>

        {/* Mobile View: CartIcon and Hamburger Menu */}
        <div className="flex items-center lg:hidden">
          <div className="mr-2">
            <CartIcon />
          </div>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">
              {isOpen ? "Close menu" : "Open menu"}
            </span>
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex lg:gap-x-12 lg:justify-end">
          <li>
            <Link
              to="/"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-primaryBtn"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/booking"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-primaryBtn"
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-primaryBtn"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-primaryBtn"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-primaryBtn"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              to="/gallery"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-primaryBtn"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-primaryBtn"
            >
              Shop
            </Link>
          </li>
          <li>
            <CartIcon />
          </li>
        </ul>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="relative z-50 w-full overflow-y-auto sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="bg-gray-300 rounded-b-xl">
              <div className="flow-root px-6 py-6">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <Link
                      to="/"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-primaryBtn"
                    >
                      Home
                    </Link>
                    <Link
                      to="/booking"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-primaryBtn"
                    >
                      Bookings
                    </Link>
                    <Link
                      to="/contact"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-primaryBtn"
                    >
                      Contact
                    </Link>
                    <Link
                      to="/about"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-primaryBtn"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/blog"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-primaryBtn"
                    >
                      Blog
                    </Link>
                    <Link
                      to="/gallery"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-primaryBtn"
                    >
                      Gallery
                    </Link>
                    <Link
                      to="/shop"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-primaryBtn"
                    >
                      Shop
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
