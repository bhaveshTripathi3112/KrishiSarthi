import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-gray-200 shadow-md px-4 lg:px-6 py-2.5">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        
        {}
        <NavLink to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-green-600">
            KrishiSarthi
          </span>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100"
          aria-controls="mobile-menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Whole Right Section (Links + Buttons) */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full lg:flex lg:w-auto lg:items-center lg:space-x-6 lg:ml-auto`}
        >
          {/* Nav Links */}
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-green-600" : "text-gray-700"
                  } hover:text-green-600 lg:p-0`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/scanner"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-green-600" : "text-gray-700"
                  } hover:text-green-600 lg:p-0`
                }
              >
                Scanner
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/heatmap"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-green-600" : "text-gray-700"
                  } hover:text-green-600 lg:p-0`
                }
              >
                Heatmap
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-green-600" : "text-gray-700"
                  } hover:text-green-600 lg:p-0`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "text-green-600" : "text-gray-700"
                  } hover:text-green-600 lg:p-0`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Chatbot & Logout Buttons stay on far right */}
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <NavLink
              to="/chatbot"
              className="text-gray-800 border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2"
            >
              Chatbot
            </NavLink>
            <NavLink
              to="/login"
              className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2"
              
            >
              Logout
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
