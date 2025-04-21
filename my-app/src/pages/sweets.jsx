import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
  doc
} from "firebase/firestore";
import "../styles/Pickles.css"; // reuse existing styling
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Sweets = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sweets"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSweets(items);
      } catch (error) {
        console.error("Error fetching sweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSweets();
  }, []);

  const handleBuyNow = (item) => {
    alert(`🍬 You clicked Buy Now for: ${item.name}`);
  };

  const handleAddToCart = async (item) => {
    try {
      await addDoc(collection(db, "cart"), {
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
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

    try {
      const q = query(wishlistRef, where("id", "==", item.id));
      const snapshot = await getDocs(q);

      if (!wishlist[item.id]) {
        await addDoc(wishlistRef, {
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          addedAt: new Date()
        });
      } else {
        snapshot.forEach(async (docItem) => {
          await deleteDoc(doc(wishlistRef, docItem.id));
        });
      }

      setWishlist((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading) return <p>Loading Sweets Products...</p>;

  return (
    <div className="product-container">
      <h2>Homemade Sweets Collection</h2>
      <div className="product-grid">
        {sweets.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="product-price">₹{item.price}</p>

            <div className="button-group">
              <div className="action-row">
                <button onClick={() => handleBuyNow(item)} className="product-btn buy-now-btn">
                  Buy Now
                </button>
                <button onClick={() => handleAddToCart(item)} className="product-btn cart-btn">
                  Add to Cart
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(item)}
                className="product-btn wishlist-btn"
                title="Toggle Wishlist"
              >
                {wishlist[item.id] ? (
                  <AiFillHeart color="red" size={20} />
                ) : (
                  <AiOutlineHeart color="gray" size={20} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sweets;
