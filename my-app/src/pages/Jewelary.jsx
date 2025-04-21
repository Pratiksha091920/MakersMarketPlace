import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/Pickles.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Jewelry = () => {
  const [jewelryItems, setJewelryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJewelryAndWishlist = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch jewelry
        const snapshot = await getDocs(collection(db, "jewelary"));
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJewelryItems(items);

        // Fetch wishlist for current user
        const q = query(
          collection(db, "wishlist"),
          where("userId", "==", user.uid)
        );
        const wishlistSnapshot = await getDocs(q);
        const wishlistMap = {};
        wishlistSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          wishlistMap[data.id] = doc.id;
        });
        setWishlist(wishlistMap);
      } catch (error) {
        console.error("Error fetching jewelry/wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJewelryAndWishlist();
  }, []);

  const handleBuyNow = (item) => {
    navigate(`/checkout/${item.id}`);
  };

  const handleAddToCart = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add to cart.");
      return;
    }

    try {
      await addDoc(collection(db, "cart"), {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        userId: user.uid,
        addedAt: new Date(),
      });
      alert(`🛍️ ${item.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add to cart.");
    }
  };

  const toggleWishlist = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to use wishlist.");
      return;
    }

    const existingDocId = wishlist[item.id];

    try {
      if (existingDocId) {
        await deleteDoc(doc(db, "wishlist", existingDocId));
        setWishlist((prev) => {
          const updated = { ...prev };
          delete updated[item.id];
          return updated;
        });
      } else {
        const docRef = await addDoc(collection(db, "wishlist"), {
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          userId: user.uid,
          addedAt: new Date(),
        });
        setWishlist((prev) => ({
          ...prev,
          [item.id]: docRef.id,
        }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading) return <p>Loading Jewelry Products...</p>;

  return (
    <div className="product-container">
      <h2>Handmade Jewelry Collection</h2>
      <div className="product-grid">
        {jewelryItems.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="product-price">₹{item.price}</p>

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
                title={
                  wishlist[item.id]
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
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

export default Jewelry;
