import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pickle from "../assets/pickle.jpg";
import papad from "../assets/papad.jpg";
import jams from "../assets/jams.jpg";
import sweets from "../assets/sweets.jpg";
import jewelry from "../assets/jewelary.jpg";
import clothes from "../assets/clothes.jpg";
import showpiece from "../assets/showpiece.jpg";
import bags from "../assets/bags.jpg";
import "../styles/Home.css";

const products = [
  { id: "pickles", name: "Homemade Pickles", img: pickle, desc: "Fresh & Organic" },
  { id: "papad", name: "Handmade Papad", img: papad, desc: "Crispy & Delicious" },
  { id: "jams", name: "Homemade Jams", img: jams, desc: "Sweet & Natural" },
  { id: "sweets", name: "Homemade Sweets", img: sweets, desc: "Traditional Taste" },
  { id: "jewelry", name: "Handmade Jewelry", img: jewelry, desc: "Elegant & Unique" },
  { id: "clothes", name: "Handmade Clothes", img: clothes, desc: "Comfort & Style" },
  { id: "showpiece", name: "Handmade Showpieces", img: showpiece, desc: "Decorative & Artistic" },
  { id: "bags", name: "Handmade Bags", img: bags, desc: "Eco-Friendly & Trendy" },
];

const ProductList = ({ page = "home" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSeeMore = (productId) => {
    const isLoggedIn = !!localStorage.getItem("user");

    if (!isLoggedIn && page === "home") {
      alert("🚫 Please log in to see more details.");
      return;
    }

    if (productId === "pickles") {
      navigate("/pickles");
    } else {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <section className="products">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2>Featured Products</h2>

      <div className={`product-list ${page === "dashboard" ? "dashboard-layout" : ""}`}>
        {filteredProducts.map((product) => (
          <div className="product" key={product.id}>
            <img src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.desc}</p>
            <button
              className="see-more"
              onClick={() => handleSeeMore(product.id)}
            >
               See More
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
