import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../context/AuthContext";  // ✅ Correct
import "../styles/Home.css"; // Ensure styling is applied

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Conditionally render Home link based on user login state
  const renderHomeLink = () => {
    if (!user) {
      return (
        <li>
          <Link to="/">Home</Link>
        </li>
      );
    }
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">Makers Marketplace</Link>
      </div>
      
      <nav>
        <ul className="nav-list">
          {renderHomeLink()}

          {/* Dropdown for Categories */}
          <li
            className="dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="dropdown-toggle" aria-expanded={dropdownOpen}>
              Categories ▼
            </span>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/pickles">Homemade Pickles</Link></li>
                <li><Link to="/papad">Homemade Papad</Link></li>
                <li><Link to="/jams">Homemade Jams</Link></li>
                <li><Link to="/jewelry">Handmade Jewelry</Link></li>
                <li><Link to="/clothes">Handmade Clothes</Link></li>
                <li><Link to="/showpiece">Handmade Showpiece</Link></li>
                <li><Link to="/bags">Handmade Bags</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/about">About Us</Link>
          </li>

          {/* Show "Logout" if user is logged in, otherwise show "Login" */}
          <li>
            {user ? (
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
