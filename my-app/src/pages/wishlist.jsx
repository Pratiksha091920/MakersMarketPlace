import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  doc,
  query,
  where,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import "../styles/pickles.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState(null);
  const auth = getAuth();

  const fetchWishlist = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("Please login to view wishlist");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      setWishlistItems(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) fetchWishlist();
      else setWishlistItems([]);
    });
    return unsubscribe;
  }, []);

  const verifyOwnership = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() && docSnap.data().userId === auth.currentUser?.uid;
  };

  const handleAddToCart = async (item) => {
    if (!auth.currentUser) {
      setError("Please login first");
      return;
    }

    setActiveId(item.id);
    try {
      // Verify item belongs to user
      if (!(await verifyOwnership("wishlist", item.id))) {
        throw new Error("Item ownership verification failed");
      }

      await addDoc(collection(db, "cart"), {
        ...item,
        userId: auth.currentUser.uid,
        addedAt: serverTimestamp()
      });

      await removeFromWishlist(item.id);
    } catch (err) {
      console.error("Operation failed:", err);
      setError(err.message || "Operation failed");
    } finally {
      setActiveId(null);
    }
  };

  const removeFromWishlist = async (itemId) => {
    setActiveId(itemId);
    try {
      if (!(await verifyOwnership("wishlist", itemId))) {
        throw new Error("Not authorized to remove this item");
      }

      await deleteDoc(doc(db, "wishlist", itemId));
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Deletion failed:", err);
      setError(err.message);
    } finally {
      setActiveId(null);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-content product-container">
        <h2>Your Wishlist</h2>
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : wishlistItems.length === 0 ? (
          <p className="empty-message">No items in wishlist.</p>
        ) : (
          <div className="product-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="product-card">
                <img src={item.imageUrl} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="product-price">₹{item.price}</p>
                <div className="button-group">
                  <button
                    className={`product-btn cart-btn ${activeId === item.id ? "disabled" : ""}`}
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={activeId === item.id}
                  >
                    {activeId === item.id ? "Processing..." : "Remove"}
                  </button>
                  <button
                    className={`product-btn buy-now-btn ${activeId === item.id ? "disabled" : ""}`}
                    onClick={() => handleAddToCart(item)}
                    disabled={activeId === item.id}
                  >
                    {activeId === item.id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;