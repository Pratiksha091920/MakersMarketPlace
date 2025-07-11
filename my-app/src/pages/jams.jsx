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
import "../styles/Pickles.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Jams = () => {
  const [jamItems, setJamItems] = useState([]);
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

        // Fetch jams
        const jamsQuery = query(collection(db, "jams"));
        const jamsSnapshot = await getDocs(jamsQuery);
        const jamsData = jamsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJamItems(jamsData);

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

  const handleBuyNow = (item) => {
    navigate(`/checkout/${item.id}`);
  };

  const handleAddToCart = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add items to cart");
      navigate('/login');
      return;
    }

    try {
      await addDoc(collection(db, "cart"), {
        productId: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        userId: user.uid,
        quantity: 1,
        addedAt: serverTimestamp()
      });
      alert(`🛒 ${item.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const toggleWishlist = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to use wishlist");
      navigate('/login');
      return;
    }

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
          productId: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
        setWishlist(prev => ({
          ...prev,
          [item.id]: docRef.id
        }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading jams...</div>;

  return (
    <div className="product-container">
      <h2>Delicious Homemade Jams</h2>
      <div className="product-grid">
        {jamItems.map((item) => (
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

export default Jams;
