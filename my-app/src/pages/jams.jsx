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
import "../styles/Pickles.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Jams = () => {
  const [jams, setJams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchJamsAndWishlist = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch jams
        const jamSnapshot = await getDocs(collection(db, "jams"));
        const jamList = jamSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJams(jamList);

        // Fetch wishlist
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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJamsAndWishlist();
  }, []);

  const handleBuyNow = (jam) => {
    navigate(`/checkout/${jam.id}`);
  };

  const handleAddToCart = async (jam) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add to cart.");
      return;
    }

    try {
      await addDoc(collection(db, "cart"), {
        id: jam.id,
        name: jam.name,
        price: jam.price,
        description: jam.description,
        imageUrl: jam.imageUrl,
        userId: user.uid,
        addedAt: new Date(),
      });
      alert(`🛒 ${jam.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add to cart.");
    }
  };

  const toggleWishlist = async (jam) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to use wishlist.");
      return;
    }

    const wishlistRef = collection(db, "wishlist");
    const existingDocId = wishlist[jam.id];

    try {
      if (existingDocId) {
        await deleteDoc(doc(db, "wishlist", existingDocId));
        setWishlist((prev) => {
          const updated = { ...prev };
          delete updated[jam.id];
          return updated;
        });
      } else {
        const docRef = await addDoc(wishlistRef, {
          id: jam.id,
          name: jam.name,
          price: jam.price,
          description: jam.description,
          imageUrl: jam.imageUrl,
          userId: user.uid,
          addedAt: new Date(),
        });
        setWishlist((prev) => ({
          ...prev,
          [jam.id]: docRef.id,
        }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading) return <p>Loading Products...</p>;

  return (
    <div className="product-container">
      <h2>Our Delicious Jams</h2>
      <div className="product-grid">
        {jams.map((jam) => (
          <div className="product-card" key={jam.id}>
            <img src={jam.imageUrl} alt={jam.name} />
            <h3>{jam.name}</h3>
            <p>{jam.description}</p>
            <p className="product-price">₹{jam.price}</p>

            <div className="button-group">
              <div className="action-row">
                <button
                  onClick={() => handleBuyNow(jam)}
                  className="product-btn buy-now-btn"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCart(jam)}
                  className="product-btn cart-btn"
                >
                  Add to Cart
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(jam)}
                className="wishlist-btn"
                title={
                  wishlist[jam.id]
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                {wishlist[jam.id] ? (
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

export default Jams;
