import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const clothesProducts = [
  // Women Section
  {
    name: "Cotton Kurti",
    description: "Hand-stitched cotton kurti with block print design.",
    price: 450,
    imageUrl: "cotton-kurti.jpg",
    category: "Women",
  },
  {
    name: "Silk Saree",
    description: "Handwoven silk saree with zari border.",
    price: 1200,
    imageUrl: "silk-saree.jpg",
    category: "Women",
  },
  {
    name: "Handmade Maxi Dress",
    description: "Floral handmade maxi dress with flare design.",
    price: 990,
    imageUrl: "maxi-dress.jpg",
    category: "Women",
  },

  // Men Section
  {
    name: "Handmade Cotton Kurta",
    description: "Simple and elegant cotton kurta for men.",
    price: 750,
    imageUrl: "men-cotton-kurta.jpg",
    category: "Men",
  },
  {
    name: "Khadi Nehru Jacket",
    description: "Stylish Nehru jacket made from pure khadi fabric.",
    price: 950,
    imageUrl: "khadi-nehru-jacket.jpg",
    category: "Men",
  },
  {
    name: "Woolen Shawl for Men",
    description: "Warm woolen shawl with hand embroidery.",
    price: 1050,
    imageUrl: "men-woolen-shawl.jpg",
    category: "Men",
  },

  // Kids Section
  {
    name: "Handmade Frock",
    description: "Cute floral frock for little girls.",
    price: 350,
    imageUrl: "kids-frock.jpg",
    category: "Kids",
  },
  {
    name: "Kids Kurta Pajama",
    description: "Comfortable handmade cotton kurta pajama set.",
    price: 500,
    imageUrl: "kids-kurta.jpg",
    category: "Kids",
  },
  {
    name: "Knitted Wool Sweater",
    description: "Hand-knitted colorful sweater for toddlers.",
    price: 600,
    imageUrl: "kids-sweater.jpg",
    category: "Kids",
  },
];

const UploadClothes = () => {
  const handleUpload = async () => {
    const clothesCollection = collection(db, "clothes");
    try {
      for (let cloth of clothesProducts) {
        const docRef = await addDoc(clothesCollection, cloth);
        console.log(`✅ ${cloth.name} uploaded with ID: ${docRef.id}`);
      }
      alert("🎉 All clothes uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error.message);
    }
  };

  const handleBuyNow = (productName) => {
    alert(`🛒 You clicked Buy Now for: ${productName}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Handmade Clothes to Firestore</h2>
      <button onClick={handleUpload} style={{ marginBottom: "2rem" }}>
        Upload Clothes
      </button>

      {/* Preview Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {clothesProducts.map((item, index) => (
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
              src={item.imageUrl}
              alt={item.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Category: <strong>{item.category}</strong></p>
            <p>₹{item.price}</p>
            <button
              onClick={() => handleBuyNow(item.name)}
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

export default UploadClothes;
