// Cart.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import "../styles/pickles.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const fetchCartItems = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, "cart"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (id) => {
    try {
      await deleteDoc(doc(db, "cart", id));
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <div className="product-container">
      <h2>🛒 Your Cart</h2>
      {loading ? (
        <p>Loading your cart...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="product-grid">
          {cartItems.map((item) => (
            <div className="product-card" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="product-price">₹{item.price}</p>
              <div className="button-group">
                <button
                  className="product-btn cart-btn"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
