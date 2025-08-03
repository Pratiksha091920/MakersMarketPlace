import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import "../styles/Home.css";
import heroImage from "../assets/hero.jpeg";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For search input if needed
  const [loading, setLoading] = useState(true);     // For loading state

  useEffect(() => {
    // Simulate loading delay (e.g., API call)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="main-container">
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

        {/* Product List */}
        <ProductList />
      </div>
    </div>
  );
};

export default Home;
