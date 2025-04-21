import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const jamProducts = [
  {
    name: "Strawberry Jam",
    description: "Sweet and tangy jam made with real strawberries.",
    price: 150,
    imageUrl: "https://your-image-url.com/strawberry.jpg",
  },
  {
    name: "Mango Jam",
    description: "Delicious homemade mango jam with tropical flavor.",
    price: 160,
    imageUrl: "https://your-image-url.com/mango.jpg",
  },
  {
    name: "Mixed Fruit Jam",
    description: "Blend of various fruits for a burst of flavors.",
    price: 170,
    imageUrl: "https://your-image-url.com/mixedfruit.jpg",
  },
  {
    name: "Pineapple Jam",
    description: "Zesty pineapple jam with a tropical twist.",
    price: 140,
    imageUrl: "https://your-image-url.com/pineapple.jpg",
  },
  {
    name: "Apple Jam",
    description: "Classic apple jam with a hint of cinnamon.",
    price: 155,
    imageUrl: "https://your-image-url.com/apple.jpg",
  },
  {
    name: "Orange Marmalade",
    description: "Citrusy marmalade with orange peel for extra flavor.",
    price: 165,
    imageUrl: "https://your-image-url.com/orange.jpg",
  },
  {
    name: "Guava Jam",
    description: "Smooth and sweet guava jam perfect for breakfast.",
    price: 145,
    imageUrl: "https://your-image-url.com/guava.jpg",
  },
  {
    name: "Blueberry Jam",
    description: "Rich blueberry flavor made from handpicked berries.",
    price: 180,
    imageUrl: "https://your-image-url.com/blueberry.jpg",
  },
  {
    name: "Apricot Jam",
    description: "Bright and flavorful jam with apricot pieces.",
    price: 175,
    imageUrl: "https://your-image-url.com/apricot.jpg",
  },
  {
    name: "Rose Petal Jam (Gulkand)",
    description: "Traditional gulkand made from fresh rose petals.",
    price: 190,
    imageUrl: "https://your-image-url.com/gulkand.jpg",
  },
];

const UploadJams = () => {
  const handleUpload = async () => {
    const jamsCollection = collection(db, "jams");
    try {
      for (let jam of jamProducts) {
        const docRef = await addDoc(jamsCollection, {
          ...jam,
          addedAt: new Date(),
        });
        console.log(`✅ ${jam.name} uploaded with ID: ${docRef.id}`);
      }
      alert("🎉 All jam items uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error.message);
      alert("Upload failed.");
    }
  };

  const handleBuyNow = (productName) => {
    alert(`🛒 You clicked Buy Now for: ${productName}`);
  };

  return (
    <div style={{ padding: "2rem", width: "100vw" }}>
      <h2>Upload Jams to Firestore</h2>
      <button onClick={handleUpload} style={{ marginBottom: "2rem" }}>
        Upload Jams
      </button>

      {/* Preview Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {jamProducts.map((jam, index) => (
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
              src={jam.imageUrl}
              alt={jam.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h3>{jam.name}</h3>
            <p>{jam.description}</p>
            <p>₹{jam.price}</p>
            <button
              onClick={() => handleBuyNow(jam.name)}
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

export default UploadJams;
