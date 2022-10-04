import React from "react";
import "./Navbar.css";
const Navbar = (props) => {
  return (
    <nav>
      <ul className="nav-list">
        <li className="nav-item">
          <a href="#" className="nav-item-text">
            About
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-item-text">
            Networks
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-item-text">
            Devices
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-item-text">
            Sharing
          </a>
        </li>
      </ul>
      <ul className="login-section">
        <li>
          <a href="#" className="nav-item-text material-icons">
            account_circle
          </a>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;
