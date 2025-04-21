import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import "../styles/Pickles.css"; // You can rename it or use Showpieces.css
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Showpieces = () => {
  const [showpieces, setShowpieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    const fetchShowpiecesAndWishlist = async () => {
      try {
        const snapshot = await getDocs(collection(db, "showpieces"));
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setShowpieces(list);

        const wishlistSnapshot = await getDocs(collection(db, "wishlist"));
        const wishlistMap = {};
        wishlistSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.id) {
            wishlistMap[data.id] = doc.id;
          }
        });
        setWishlist(wishlistMap);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowpiecesAndWishlist();
  }, []);

  const handleBuyNow = (item) => {
    alert(`🛒 You clicked Buy Now for: ${item.name}`);
  };

  const handleAddToCart = async (item) => {
    try {
      await addDoc(collection(db, "cart"), {
        ...item,
        addedAt: new Date()
      });
      alert(`🛍️ ${item.name} added to cart`);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const toggleWishlist = async (item) => {
    const wishlistRef = collection(db, "wishlist");
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
        const docRef = await addDoc(wishlistRef, {
          ...item,
          addedAt: new Date()
        });
        setWishlist(prev => ({
          ...prev,
          [item.id]: docRef.id
        }));
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  if (loading) return <p>Loading Showpieces...</p>;

  return (
    <div className="product-container">
      <h2>Our Handmade Showpieces</h2>
      <div className="product-grid">
        {showpieces.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="product-price">₹{item.price}</p>
            <p style={{ fontSize: "0.9rem", color: "#888" }}>{item.category}</p>

            <div className="button-group">
              <div className="action-row">
                <button
                  onClick={() => handleBuyNow(item)}
                  className="product-btn buy-now-btn"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="product-btn cart-btn"
                >
                  Add to Cart
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(item)}
                className="wishlist-btn"
                title={wishlist[item.id] ? "Remove from Wishlist" : "Add to Wishlist"}
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
