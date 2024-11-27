import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active tab highlighting
import "./Navbar.css"; // External CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Company Logo */}
      <div className="navbar-logo">
        <img src="/path-to-your-logo.png" alt="Company Logo" />
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <NavLink
          to="/data-entry" /* Link "Orders" to DataEntryPage.jsx */
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Analytics
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
