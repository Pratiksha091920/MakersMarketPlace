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

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const auth = getAuth();

  // Fetch wishlist items for the logged-in user
  const fetchWishlistItems = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((docSnap) => ({
        docId: docSnap.id,
        ...docSnap.data(),
      }));

      // Debug: log fetched items
      console.log("Fetched wishlist items:", items);
      items.forEach((item) => {
        if (!item.description) {
          console.warn("Missing description for item:", item);
        }
      });

      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (docId) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      setRemovingId(docId);

      const wishlistDocRef = doc(db, "wishlist", docId);
      const docSnapshot = await getDoc(wishlistDocRef);

      if (!docSnapshot.exists()) {
        console.warn("This wishlist item may have already been removed.");
        alert("This item no longer exists in your wishlist.");
        return;
      }

      const data = docSnapshot.data();

      if (data.userId !== user.uid) {
        console.error("Permission denied: not your item.");
        alert("Permission denied.");
        return;
      }

      await deleteDoc(wishlistDocRef);
      console.log("Item removed from wishlist.");
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.docId !== docId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [auth.currentUser]);

  return (
    <div className="product-container">
      <h2 style={{ marginBottom: "2rem", color: "#333" }}>Your Wishlist</h2>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="empty-message">
          <p>Your wishlist is empty!</p>
        </div>
      ) : (
        <div className="product-grid">
          {wishlistItems.map((item) => (
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
                        "Are you sure you want to remove this item from your wishlist?"
                      )
                    ) {
                      removeFromWishlist(item.docId);
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

export default Wishlist;
