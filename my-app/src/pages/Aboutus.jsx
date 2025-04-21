import React from "react";
import "../styles/AboutUs.css"; // ✅ Import CSS for styling

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-header">
        <h1>About Makers Marketplace</h1>
        <p>Empowering Women Entrepreneurs in the Home Business Industry</p>
      </div>

      <section className="about-content">
        <h2>Our Mission</h2>
        <p>
          Makers Marketplace is dedicated to supporting women entrepreneurs who create homemade items 
          such as pickles, papads, and handcrafted jewelry. Our goal is to provide a platform that 
          helps them reach a wider audience and grow their businesses.
        </p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>🛒 Easy-to-use platform for selling homemade products</li>
          <li>🤝 Connecting customers directly with home-based businesses</li>
          <li>🚀 Empowering women by providing a digital marketplace</li>
          <li>📦 Secure and reliable transactions</li>
        </ul>

        <h2>Meet Our Team</h2>
        <p>
          We are a group of passionate individuals who believe in empowering women through technology. 
          Our team is committed to building an inclusive platform where every small business can thrive.
        </p>

        <h2>Contact Us</h2>
        <p>Email: support@makersmarketplace.com</p>
        <p>Phone: +91 9876543210</p>
      </section>
    </div>
  );
};

export default AboutUs;
