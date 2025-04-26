import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import "../styles/checkout.css";

const Checkout = () => {
  const { id } = useParams(); // get product ID from URL
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, [auth]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const collections = ["pickles", "papads","jams","sweets","jewelary"];
        let foundProduct = null;

        for (const collectionName of collections) {
          const productRef = doc(db, collectionName, id);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            foundProduct = { id: productSnap.id, ...productSnap.data() };
            break;
          }
        }

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          alert("Product not found.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Error fetching product details.");
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handlePlaceOrder = async () => {
    if (!name || !address || !city || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    if (!user || !product) {
      alert("Missing user or product information.");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customerName: name,
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        address,
        city,
        phone,
        paymentMethod: "Cash on Delivery",
        status: "pending",
        orderedAt: new Date().toISOString(),
      });

      alert("✅ Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Failed to place order.");
    }
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2>Checkout</h2>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="checkout-img"
        />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="checkout-price">₹{product.price}</p>

        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label>Delivery Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full delivery address"
          ></textarea>
        </div>

        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label>Payment Method:</label>
          <input type="text" value="Cash on Delivery" disabled />
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
