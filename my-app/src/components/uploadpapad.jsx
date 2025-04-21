import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const papadProducts = [
  {
    name: "Urad Dal Papad",
    description: "Classic urad dal papad with a crisp texture.",
    price: 100,
    imageUrl: "https://your-image-url.com/urad.jpg",
  },
  {
    name: "Moong Dal Papad",
    description: "Light and crunchy papad made from moong dal.",
    price: 110,
    imageUrl: "https://your-image-url.com/moong.jpg",
  },
  {
    name: "Chana Dal Papad",
    description: "Spicy chana dal papad with traditional flavors.",
    price: 120,
    imageUrl: "https://your-image-url.com/chana.jpg",
  },
  {
    name: "Masala Papad",
    description: "Ready-to-eat spicy masala papad snack.",
    price: 130,
    imageUrl: "https://your-image-url.com/masala.jpg",
  },
  {
    name: "Jeera Papad",
    description: "Papad with the aromatic taste of cumin seeds.",
    price: 90,
    imageUrl: "https://your-image-url.com/jeera.jpg",
  },
  {
    name: "Black Pepper Papad",
    description: "Peppery papad for a bold and spicy crunch.",
    price: 140,
    imageUrl: "https://your-image-url.com/pepper.jpg",
  },
  {
    name: "Garlic Papad",
    description: "Flavorful garlic-infused papad.",
    price: 115,
    imageUrl: "https://your-image-url.com/garlic-papad.jpg",
  },
  {
    name: "Plain Papad",
    description: "Traditional plain papad, perfect for all meals.",
    price: 85,
    imageUrl: "https://your-image-url.com/plain.jpg",
  },
  {
    name: "Punjabi Papad",
    description: "Spicy and flavorful Punjabi-style papad.",
    price: 125,
    imageUrl: "https://your-image-url.com/punjabi.jpg",
  },
  {
    name: "Rice Papad",
    description: "Crispy and light papad made from rice flour.",
    price: 105,
    imageUrl: "https://your-image-url.com/rice.jpg",
  },
];

const UploadPapads = () => {
  const handleUpload = async () => {
    const papadCollection = collection(db, "papads");
    try {
      for (let papad of papadProducts) {
        const docRef = await addDoc(papadCollection, papad);
        console.log(`✅ ${papad.name} uploaded with ID: ${docRef.id}`);
      }
      alert("🎉 All papads uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error.message);
    }
  };

  const handleBuyNow = (productName) => {
    alert(`🛒 You clicked Buy Now for: ${productName}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Papads to Firestore</h2>
      <button onClick={handleUpload} style={{ marginBottom: "2rem" }}>
        Upload Papads
      </button>

      {/* Preview Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {papadProducts.map((papad, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <img
              src={papad.imageUrl}
              alt={papad.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h3>{papad.name}</h3>
            <p>{papad.description}</p>
            <p>₹{papad.price}</p>
            <button
              onClick={() => handleBuyNow(papad.name)}
              style={{ marginTop: "0.5rem" }}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPapads;
