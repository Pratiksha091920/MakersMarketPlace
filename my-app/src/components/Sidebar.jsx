import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/dashboard">🏠 Dashboard</Link></li>
        <li><Link to="/orders">📦 My Orders</Link></li>
        <li><Link to="/wishlist">❤️ Wishlist</Link></li>
        <li><Link to="/cart">🛒 Cart</Link></li>  {/* ✅ Added Cart Option */}
        {/* <li><Link to="/profile">👤profile </Link></li> */}
      </ul>
    </aside>
  );
};

export default Sidebar;
