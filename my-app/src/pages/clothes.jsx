import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import "../styles/Pickles.css"; // You can rename this to Clothes.css if preferred
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Clothes = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({}); // { clothingId: wishlistDocId }

  useEffect(() => {
    const fetchClothesAndWishlist = async () => {
      try {
        // Fetch clothes
        const clothesSnapshot = await getDocs(collection(db, "clothes"));
        const clothesList = clothesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClothes(clothesList);

        // Fetch wishlist
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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClothesAndWishlist();
  }, []);

  const handleBuyNow = (item) => {
    alert(`🛒 You clicked Buy Now for: ${item.name}`);
  };

  const handleAddToCart = async (item) => {
    try {
      await addDoc(collection(db, "cart"), {
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        category: item.category,
        addedAt: new Date()
      });
      alert(`🛍️ ${item.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add to cart.");
    }
  };

  const toggleWishlist = async (item) => {
    const wishlistRef = collection(db, "wishlist");
    const existingDocId = wishlist[item.id];

    try {
      if (existingDocId) {
        // Remove from wishlist
        await deleteDoc(doc(db, "wishlist", existingDocId));
        setWishlist(prev => {
          const updated = { ...prev };
          delete updated[item.id];
          return updated;
        });
      } else {
        // Add to wishlist
        const docRef = await addDoc(wishlistRef, {
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
          addedAt: new Date()
        });
        setWishlist(prev => ({
          ...prev,
          [item.id]: docRef.id
        }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading) return <p>Loading Clothes...</p>;

  return (
    <div className="product-container">
      <h2>Our Handmade Clothes</h2>
      <div className="product-grid">
        {clothes.map((item) => (
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

export default Clothes;
