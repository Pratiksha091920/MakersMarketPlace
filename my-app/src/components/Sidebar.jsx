import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="menu-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      {/* Sidebar Menu */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul onClick={() => setIsOpen(false)}>
          <li><Link to="/dashboard">🏠 Dashboard</Link></li>
          <li><Link to="/orders">📦 My Orders</Link></li>
          <li><Link to="/wishlist">❤️ Wishlist</Link></li>
          <li><Link to="/cart">🛒 Cart</Link></li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
