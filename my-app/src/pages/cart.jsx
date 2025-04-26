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
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import "../styles/pickles.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const auth = getAuth();

  // Fetch cart items from Firestore
  const fetchCartItems = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to view your cart.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, "cart"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchCartItems on component mount and auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchCartItems();
      } else {
        setCartItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Remove item from cart with security validation
  const handleRemoveFromCart = async (docId) => {
    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to remove items from your cart.");
      return;
    }
  
    try {
      setRemovingId(docId);
      
      // 1. First get the document to verify ownership
      const cartDocRef = doc(db, "cart", docId);
      const cartDocSnap = await getDoc(cartDocRef);
  
      if (!cartDocSnap.exists()) {
        throw new Error("Item not found in cart");
      }
  
      // 2. Verify the item belongs to current user
      const cartData = cartDocSnap.data();
      if (!cartData.userId || cartData.userId !== user.uid) {
        throw new Error("You don't have permission to remove this item");
      }
  
      // 3. Only then delete it
      await deleteDoc(cartDocRef);
      
      // 4. Update local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
    } catch (error) {
      console.error("Error removing item:", error);
      setError(error.message);
      
      // Specific handling for Firestore errors
      if (error.code === 'permission-denied') {
        setError("Permission denied. Please refresh and try again.");
        // Force refresh cart data
        await fetchCartItems();
      }
    } finally {
      setRemovingId(null);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="product-container">
      <h2>🛒 Your Cart</h2>
      
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
          <p>Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty!</p>
          <a href="/products" className="shop-btn">Continue Shopping</a>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {cartItems.map((item) => (
              <div className="product-card" key={item.id}>
                <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <p className="product-price">₹{item.price.toFixed(2)}</p>
                  <p className="item-quantity">Qty: {item.quantity || 1}</p>
                </div>
                <button
                  className={`product-btn cart-btn ${removingId === item.id ? "removing" : ""}`}
                  onClick={() => handleRemoveFromCart(item.id)}
                  disabled={removingId === item.id}
                >
                  {removingId === item.id ? "Removing..." : "Remove"}
                </button>
              </div>
            ))}
          </div>

          
        </>
      )}
    </div>
  );
};

export default Cart;