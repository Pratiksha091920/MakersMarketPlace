import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const sweetProducts = [
  {
    name: "Gulab Jamun",
    category: "Milk Sweets",
    description: "Soft milk-solid dumplings soaked in rose-flavored sugar syrup.",
    price: 180,
    imageUrl: "gulab-jamun.jpg",
  },
  {
    name: "Kaju Katli",
    category: "Dry Fruit Sweets",
    description: "Thin cashew fudge made with pure cashews and sugar.",
    price: 240,
    imageUrl: "kaju-katli.jpg",
  },
  {
    name: "Besan Ladoo",
    category: "Ladoo",
    description: "Chickpea flour and ghee-based round ladoos with rich flavor.",
    price: 160,
    imageUrl: "besan-ladoo.jpg",
  },
  {
    name: "Rasgulla",
    category: "Bengali Sweets",
    description: "Spongy white cheese balls in light syrup, a Bengali classic.",
    price: 150,
    imageUrl: "rasgulla.jpg",
  },
  {
    name: "Soan Papdi",
    category: "Flaky Sweets",
    description: "Flaky cube sweet with a melt-in-mouth texture and nutty flavor.",
    price: 130,
    imageUrl: "soan-papdi.jpg",
  },
  {
    name: "Motichoor Ladoo",
    category: "Festival Sweets",
    description: "Tiny ball ladoos made with boondi, perfect for celebrations.",
    price: 170,
    imageUrl: "motichoor-ladoo.jpg",
  },
  {
    name: "Balushahi",
    category: "Traditional Sweets",
    description: "Crispy from outside, soft inside, deep-fried and soaked in sugar syrup.",
    price: 180,
    imageUrl: "balushahi.jpg",
  },
  {
    name: "Peda",
    category: "Temple Sweets",
    description: "Soft, round sweets made from khoya, often used in prasad.",
    price: 160,
    imageUrl: "peda.jpg",
  },
  {
    name: "Halwa",
    category: "Grain Sweets",
    description: "Semolina-based sweet dish flavored with ghee and cardamom.",
    price: 140,
    imageUrl: "halwa.jpg",
  },
  {
    name: "Chikki",
    category: "Healthy Sweets",
    description: "Brittle made with jaggery and peanuts—crunchy and nutritious.",
    price: 120,
    imageUrl: "chikki.jpg",
  },
];

const UploadSweets = () => {
  const handleUpload = async () => {
    const sweetsCollection = collection(db, "sweets");
    try {
      for (let sweet of sweetProducts) {
        const docRef = await addDoc(sweetsCollection, sweet);
        console.log(`✅ ${sweet.name} uploaded with ID: ${docRef.id}`);
      }
      alert("🎉 All sweets uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Sweets to Firestore</h2>
      <button onClick={handleUpload} style={{ marginBottom: "2rem" }}>
        Upload Sweets
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {sweetProducts.map((sweet, index) => (
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
              src={sweet.imageUrl}
              alt={sweet.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h3>{sweet.name}</h3>
            <p><strong>Category:</strong> {sweet.category}</p>
            <p>{sweet.description}</p>
            <p>₹{sweet.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadSweets;
