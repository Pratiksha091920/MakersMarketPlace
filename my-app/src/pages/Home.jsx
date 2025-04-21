import React, { useState } from "react";
import ProductList from "../components/ProductList"; 
import "../styles/Home.css";
import heroImage from "../assets/hero.jpeg";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term when user types
  };

  return (
    <div className="main-container">
      {/* Main Content */}
      <div className="content">
        <section
          className="hero"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h2>Empowering Women Entrepreneurs</h2>
          <p>Buy homemade products directly from talented women.</p>
        </section>
        
        <br />

        {/* Product List Component */}
        <ProductList />
      </div>
    </div>
  );
};

export default Home;
