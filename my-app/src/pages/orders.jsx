import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import "../styles/pickles.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const auth = getAuth();

  const fetchOrders = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to view your orders.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query orders collection
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("orderedAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          formattedDate: new Date(data.orderedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        };
      });

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) fetchOrders();
      else {
        setOrders([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const formatStatus = (status) => {
    const statusClasses = {
      pending: "status-pending",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled"
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || "status-default"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError(null)} className="dismiss-btn">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet!</p>
          <a href="/pickles" className="shop-btn">Browse Products</a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-summary" onClick={() => toggleOrderDetails(order.id)}>
                <div className="order-info">
                  <span className="order-id">Order #{order.id.substring(0, 8)}</span>
                  <span className="order-date">{order.formattedDate}</span>
                  <span className="order-price">₹{order.price.toFixed(2)}</span>
                  {formatStatus(order.status)}
                </div>
                <button className="toggle-btn">
                  {expandedOrder === order.id ? "▲" : "▼"}
                </button>
              </div>

              {expandedOrder === order.id && (
                <div className="order-details">
                  <div className="product-info">
                    <img src={order.imageUrl} alt={order.productName} className="product-image" />
                    <div>
                      <h3>{order.productName}</h3>
                      <p>Product ID: {order.productId}</p>
                    </div>
                  </div>

                  <div className="shipping-info">
                    <h4>Shipping Details</h4>
                    <p>
                      <strong>{order.customerName}</strong><br />
                      {order.address}<br />
                      {order.city}<br />
                      Phone: {order.phone}
                    </p>
                  </div>

                  <div className="payment-info">
                    <h4>Payment Information</h4>
                    <p>
                      Method: {order.paymentMethod}<br />
                      Status: {formatStatus(order.status)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;