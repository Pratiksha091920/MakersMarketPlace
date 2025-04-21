import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/ProductList";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="customer-dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <ProductList page="dashboard" searchTerm={searchTerm} />
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
