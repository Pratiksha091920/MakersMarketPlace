import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "../styles/SellerDashboard.css"; // Ensure you have styles

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulated API call to fetch seller's products
    setProducts([
      { id: 1, name: "Homemade Pickle", price: "$10", stock: 25 },
      { id: 2, name: "Handmade Jewelry", price: "$20", stock: 15 },
    ]);

    // Simulated API call to fetch orders
    setOrders([
      { id: 101, product: "Homemade Pickle", status: "Shipped" },
      { id: 102, product: "Handmade Jewelry", status: "Pending" },
    ]);
  }, []);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Seller Panel</h2>
        <ul>
          <li onClick={() => navigate("/seller/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/seller/products")}>Manage Products</li>
          <li onClick={() => navigate("/seller/orders")}>View Orders</li>
          <li onClick={handleLogout} className="logout-btn">Logout</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <h1>Welcome, {user?.email}</h1>
        
        <section className="stats">
          <div className="stat-box">Total Products: {products.length}</div>
          <div className="stat-box">Total Orders: {orders.length}</div>
          <div className="stat-box">Pending Orders: {orders.filter(order => order.status === "Pending").length}</div>
        </section>

        <section className="product-list">
          <h2>Your Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.name} - {product.price} (Stock: {product.stock})
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default SellerDashboard;
