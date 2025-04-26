import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import "../styles/Pickles.css";

const Showpieces = () => {
  const [showpieces, setShowpieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch showpieces
        const showpiecesSnapshot = await getDocs(collection(db, "showpieces"));
        setShowpieces(showpiecesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

        // Fetch user's wishlist if logged in
        if (auth.currentUser) {
          const wishlistQuery = query(
            collection(db, "wishlist"),
            where("userId", "==", auth.currentUser.uid)
          );
          const wishlistSnapshot = await getDocs(wishlistQuery);
          
          const wishlistMap = {};
          wishlistSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.productId) {  // Changed from 'id' to 'productId'
              wishlistMap[data.productId] = doc.id;
            }
          });
          setWishlist(wishlistMap);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.currentUser?.uid]);  // Re-fetch when user changes

  const handleAddToCart = async (item) => {
    if (!auth.currentUser) {
      setError("Please login to add to cart");
      return;
    }

    setActiveItem(item.id);
    try {
      await addDoc(collection(db, "cart"), {
        ...item,
        userId: auth.currentUser.uid,
        addedAt: serverTimestamp()
      });
      alert(`${item.name} added to cart!`);
    } catch (error) {
      console.error("Cart error:", error);
      setError("Failed to add to cart");
    } finally {
      setActiveItem(null);
    }
  };

  const toggleWishlist = async (item) => {
    if (!auth.currentUser) {
      setError("Please login to manage wishlist");
      return;
    }

    setActiveItem(item.id);
    const existingDocId = wishlist[item.id];

    try {
      if (existingDocId) {
        await deleteDoc(doc(db, "wishlist", existingDocId));
        setWishlist(prev => {
          const updated = { ...prev };
          delete updated[item.id];
          return updated;
        });
      } else {
        const docRef = await addDoc(collection(db, "wishlist"), {
          productId: item.id,  // Changed from 'id'
          userId: auth.currentUser.uid,
          ...item,
          addedAt: serverTimestamp()
        });
        setWishlist(prev => ({
          ...prev,
          [item.id]: docRef.id
        }));
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      setError("Wishlist operation failed");
    } finally {
      setActiveItem(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-container">
      <h2>Our Handmade Showpieces</h2>
      <div className="product-grid">
        {showpieces.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.imageUrl} alt={item.name} loading="lazy" />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="product-price">₹{item.price}</p>
            
            <div className="button-group">
              <button
                onClick={() => handleAddToCart(item)}
                disabled={activeItem === item.id}
                className="product-btn cart-btn"
              >
                {activeItem === item.id ? "Adding..." : "Add to Cart"}
              </button>
              
              <button
                onClick={() => toggleWishlist(item)}
                disabled={activeItem === item.id}
                className="wishlist-btn"
                aria-label={wishlist[item.id] ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlist[item.id] ? (
                  <AiFillHeart color="red" size={22} />
                ) : (
                  <AiOutlineHeart color="gray" size={22} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showpieces;