// Papad.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/pickles.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Papad = () => {
  const [papads, setPapads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const snapshot = await getDocs(collection(db, "papads"));
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPapads(items);

        const q = query(collection(db, "wishlist"), where("userId", "==", user.uid));
        const wishlistSnapshot = await getDocs(q);
        const wishlistMap = {};
        wishlistSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          wishlistMap[data.id] = doc.id;
        });
        setWishlist(wishlistMap);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuyNow = (papad) => {
    navigate(`/checkout/${papad.id}`);
  };

  const handleAddToCart = async (papad) => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to add to cart.");
    try {
      await addDoc(collection(db, "cart"), {
        ...papad,
        userId: user.uid,
        addedAt: new Date(),
      });
      alert(`🛒 ${papad.name} added to cart`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add to cart.");
    }
  };

  const toggleWishlist = async (papad) => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to use wishlist.");
    const wishlistRef = collection(db, "wishlist");
    const existingId = wishlist[papad.id];
    try {
      if (existingId) {
        await deleteDoc(doc(db, "wishlist", existingId));
        setWishlist((prev) => {
          const updated = { ...prev };
          delete updated[papad.id];
          return updated;
        });
      } else {
        const docRef = await addDoc(wishlistRef, {
          ...papad,
          userId: user.uid,
          addedAt: new Date(),
        });
        setWishlist((prev) => ({
          ...prev,
          [papad.id]: docRef.id,
        }));
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  if (loading) return <p>Loading Products...</p>;

  return (
    <div className="product-container">
      <h2>Our Crispy Papads</h2>
      <div className="product-grid">
        {papads.map((papad) => (
          <div className="product-card" key={papad.id}>
            <img src={papad.imageUrl} alt={papad.name} />
            <h3>{papad.name}</h3>
            <p>{papad.description}</p>
            <p className="product-price">₹{papad.price}</p>
            <div className="button-group">
              <div className="action-row">
                <button onClick={() => handleBuyNow(papad)} className="product-btn buy-now-btn">Buy Now</button>
                <button onClick={() => handleAddToCart(papad)} className="product-btn cart-btn">Add to Cart</button>
              </div>
              <button onClick={() => toggleWishlist(papad)} className="wishlist-btn">
                {wishlist[papad.id] ? <AiFillHeart color="red" size={22} /> : <AiOutlineHeart color="gray" size={22} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Papad;
