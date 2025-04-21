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
} from "firebase/firestore";
import "../styles/pickles.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Fetch wishlist items from Firebase Firestore
  const fetchWishlist = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, "wishlist"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Handle adding item to cart
  const handleAddToCart = async (item) => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to add to cart.");

    try {
      await addDoc(collection(db, "cart"), {
        ...item,
        userId: user.uid,
        addedAt: new Date(),
      });
      alert("Item added to cart.");

      await removeFromWishlist(item.id, item.userId); // Remove from wishlist after adding to cart
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Handle removing item from wishlist
  const removeFromWishlist = async (id, userId) => {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
      alert("You don't have permission to delete this item.");
      return;
    }

    try {
      console.log("Removing item with ID:", id);
      await deleteDoc(doc(db, "wishlist", id));
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      alert("Item removed from wishlist.");
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-content product-container">
        <h2>Your Wishlist</h2>
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
                    className="product-btn cart-btn"
                    onClick={() => removeFromWishlist(item.id, item.userId)}
                  >
                    Remove
                  </button>
                  <button
                    className="product-btn buy-now-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
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
