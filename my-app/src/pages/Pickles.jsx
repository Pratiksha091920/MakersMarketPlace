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

const Pickles = () => {
  const [pickles, setPickles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchPicklesAndWishlist = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch pickles
        const pickleSnapshot = await getDocs(collection(db, "pickles"));
        const pickleList = pickleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPickles(pickleList);

        // Fetch wishlist items for current user
        const q = query(
          collection(db, "wishlist"),
          where("userId", "==", user.uid)
        );
        const wishlistSnapshot = await getDocs(q);
        const wishlistMap = {};
        wishlistSnapshot.docs.forEach(doc => {
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

    fetchPicklesAndWishlist();
  }, []);

  const handleBuyNow = (pickle) => {
    navigate(`/checkout/${pickle.id}`);
  };

  const handleAddToCart = async (pickle) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add to cart.");
      return;
    }

    try {
      await addDoc(collection(db, "cart"), {
        id: pickle.id,
        name: pickle.name,
        price: pickle.price,
        description: pickle.description,
        imageUrl: pickle.imageUrl,
        userId: user.uid,
        addedAt: new Date(),
      });
      alert(`🛒 ${pickle.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add to cart.");
    }
  };

  const toggleWishlist = async (pickle) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to use wishlist.");
      return;
    }

    const wishlistRef = collection(db, "wishlist");
    const existingDocId = wishlist[pickle.id];

    try {
      if (existingDocId) {
        // Remove from wishlist
        await deleteDoc(doc(db, "wishlist", existingDocId));
        setWishlist(prev => {
          const updated = { ...prev };
          delete updated[pickle.id];
          return updated;
        });
      } else {
        // Add to wishlist
        const docRef = await addDoc(wishlistRef, {
          id: pickle.id,
          name: pickle.name,
          price: pickle.price,
          description: pickle.description,
          imageUrl: pickle.imageUrl,
          userId: user.uid,
          addedAt: new Date(),
        });
        setWishlist(prev => ({
          ...prev,
          [pickle.id]: docRef.id,
        }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading) return <p>Loading Products...</p>;

  return (
    <div className="product-container">
      <h2>Our Homemade Pickles</h2>
      <div className="product-grid">
        {pickles.map((pickle) => (
          <div className="product-card" key={pickle.id}>
            <img src={pickle.imageUrl} alt={pickle.name} />
            <h3>{pickle.name}</h3>
            <p>{pickle.description}</p>
            <p className="product-price">₹{pickle.price}</p>

            <div className="button-group">
              <div className="action-row">
                <button
                  onClick={() => handleBuyNow(pickle)}
                  className="product-btn buy-now-btn"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCart(pickle)}
                  className="product-btn cart-btn"
                >
                  Add to Cart
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(pickle)}
                className="wishlist-btn"
                title={
                  wishlist[pickle.id]
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                {wishlist[pickle.id] ? (
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

export default Pickles;
