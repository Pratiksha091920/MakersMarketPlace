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

const Showpieces = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const showpiecesSnapshot = await getDocs(collection(db, "showpieces"));
        const showpieceList = showpiecesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(showpieceList);

        const wishlistQuery = query(
          collection(db, "wishlist"),
          where("userId", "==", user.uid)
        );
        const wishlistSnapshot = await getDocs(wishlistQuery);
        const wishlistMap = {};
        wishlistSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          wishlistMap[data.id] = doc.id;
        });
        setWishlist(wishlistMap);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
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
        category: item.category,
        userId: user.uid,
        addedAt: new Date(),
      });
      alert(`${item.name} added to cart`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const toggleWishlist = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to manage wishlist.");
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
          category: item.category,
          userId: user.uid,
          addedAt: new Date(),
        });
        setWishlist((prev) => ({
          ...prev,
          [item.id]: docRef.id,
        }));
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <div className="product-container">
      <h2>Our Handmade Showpieces</h2>
      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="product-price">₹{item.price}</p>
            <p className="product-category">{item.category}</p>

            <div className="button-group">
              <div className="action-row">
                <button
                  className="product-btn buy-now-btn"
                  onClick={() => handleBuyNow(item)}
                >
                  Buy Now
                </button>
                <button
                  className="product-btn cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
              <button
                className="wishlist-btn"
                onClick={() => toggleWishlist(item)}
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

export default Showpieces;
