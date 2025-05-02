import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/pickles.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const auth = getAuth();

  // Fetch cart items for the logged-in user
  const fetchCartItems = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "cart"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((docSnap) => ({
        docId: docSnap.id,
        ...docSnap.data(),
      }));

      // Debug: log fetched items
      console.log("Fetched cart items:", items);
      items.forEach((item) => {
        if (!item.description) {
          console.warn("Missing description for item:", item);
        }
      });

      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (docId) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      setRemovingId(docId);

      const cartDocRef = doc(db, "cart", docId);
      const docSnapshot = await getDoc(cartDocRef);

      if (!docSnapshot.exists()) {
        console.warn("This cart item may have already been removed.");
        alert("This item no longer exists in your cart.");
        return;
      }

      const data = docSnapshot.data();

      if (data.userId !== user.uid) {
        console.error("Permission denied: not your item.");
        alert("Permission denied.");
        return;
      }

      await deleteDoc(cartDocRef);
      console.log("Item removed from cart.");
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.docId !== docId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [auth.currentUser]);

  return (
    <div className="product-container">
      <h2 style={{ marginBottom: "2rem", color: "#333" }}>Your Cart</h2>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-message">
          <p>Your cart is empty!</p>
        </div>
      ) : (
        <div className="product-grid">
          {cartItems.map((item) => (
            <div className="product-card" key={item.docId}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="product-card-img"
              />
              <div className="item-details">
                <h3>{item.name || "Unnamed Item"}</h3>
                <p className="product-description">
                  {item.description || "No description available."}
                </p>
                <p className="product-price">₹{item.price || "N/A"}</p>
              </div>
              <div className="button-group">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to remove this item from your cart?"
                      )
                    ) {
                      removeFromCart(item.docId);
                    }
                  }}
                  disabled={removingId === item.docId}
                  className="product-btn cart-btn"
                >
                  {removingId === item.docId ? "Removing..." : "Remove"}
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
