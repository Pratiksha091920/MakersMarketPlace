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
  serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/pickles.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Sweets = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch sweets
        const sweetsQuery = query(collection(db, "sweets"));
        const sweetsSnapshot = await getDocs(sweetsQuery);
        const sweetsData = sweetsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSweets(sweetsData);

        // Fetch wishlist
        const wishlistQuery = query(
          collection(db, "wishlist"),
          where("userId", "==", user.uid)
        );
        const wishlistSnapshot = await getDocs(wishlistQuery);
        const wishlistItems = {};
        wishlistSnapshot.forEach(doc => {
          wishlistItems[doc.data().productId] = doc.id;
        });
        setWishlist(wishlistItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.currentUser]);

  const handleBuyNow = (sweet) => {
    navigate(`/checkout/${sweet.id}`);
  };

  const handleAddToCart = async (sweet) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add items to cart");
      navigate('/login');
      return;
    }

    try {
      await addDoc(collection(db, "cart"), {
        productId: sweet.id,
        name: sweet.name,
        price: sweet.price,
        imageUrl: sweet.imageUrl,
        userId: user.uid,
        quantity: 1,
        addedAt: serverTimestamp()
      });
      alert(`${sweet.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const toggleWishlist = async (sweet) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to use wishlist");
      navigate('/login');
      return;
    }

    const wishlistRef = collection(db, "wishlist");
    const existingDocId = wishlist[sweet.id];

    try {
      if (existingDocId) {
        // Remove from wishlist
        await deleteDoc(doc(db, "wishlist", existingDocId));
        setWishlist(prev => {
          const updated = { ...prev };
          delete updated[sweet.id];
          return updated;
        });
      } else {
        // Add to wishlist
        const docRef = await addDoc(wishlistRef, {
          productId: sweet.id,
          name: sweet.name,
          price: sweet.price,
          imageUrl: sweet.imageUrl,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
        setWishlist(prev => ({
          ...prev,
          [sweet.id]: docRef.id
        }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading sweets...</div>;

  return (
    <div className="product-container">
      <h2>Our Delicious Sweets Collection</h2>
      <div className="product-grid">
        {sweets.map((sweet) => (
          <div className="product-card" key={sweet.id}>
            <img src={sweet.imageUrl} alt={sweet.name} />
            <h3>{sweet.name}</h3>
            <p>{sweet.description}</p>
            <p className="product-price">₹{sweet.price}</p>

            <div className="button-group">
              <div className="action-row">
                <button
                  onClick={() => handleBuyNow(sweet)}
                  className="product-btn buy-now-btn"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCart(sweet)}
                  className="product-btn cart-btn"
                >
                  Add to Cart
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(sweet)}
                className="wishlist-btn"
                aria-label={wishlist[sweet.id] ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlist[sweet.id] ? (
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

export default Sweets;