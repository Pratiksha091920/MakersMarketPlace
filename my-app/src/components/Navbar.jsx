import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../styles/Home.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For hamburger toggle
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const renderHomeLink = () => {
    if (!user) {
      return (
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
      );
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">Makers Marketplace</Link>
      </div>

      {/* Hamburger Menu Icon */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={menuOpen ? "active" : ""}>
        <ul className="nav-list">
          {renderHomeLink()}

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
                <li><Link to="/pickles" onClick={() => setMenuOpen(false)}>Homemade Pickles</Link></li>
                <li><Link to="/papad" onClick={() => setMenuOpen(false)}>Homemade Papad</Link></li>
                <li><Link to="/jams" onClick={() => setMenuOpen(false)}>Homemade Jams</Link></li>
                <li><Link to="/jewelry" onClick={() => setMenuOpen(false)}>Handmade Jewelry</Link></li>
                <li><Link to="/clothes" onClick={() => setMenuOpen(false)}>Handmade Clothes</Link></li>
                <li><Link to="/showpiece" onClick={() => setMenuOpen(false)}>Handmade Showpiece</Link></li>
                <li><Link to="/bags" onClick={() => setMenuOpen(false)}>Handmade Bags</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          </li>

          <li>
            {user ? (
              <button className="logout-btn" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
