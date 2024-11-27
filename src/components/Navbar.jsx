import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active tab highlighting
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="src\components\logo.png" alt="Company Logo" />
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <NavLink
          to="/data-entry" 
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Inventory
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
