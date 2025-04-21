import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const showpieceProducts = [
  {
    name: "Terracotta Elephant",
    category: "Clay Showpieces",
    description: "Handcrafted terracotta elephant with tribal motifs.",
    price: 450,
    imageUrl: "terracotta-elephant.jpg",
  },
  {
    name: "Wooden Carved Owl",
    category: "Wooden Crafts",
    description: "Intricately carved owl showpiece made from natural wood.",
    price: 600,
    imageUrl: "wooden-owl.jpg",
  },
  {
    name: "Glass Peacock",
    category: "Glass Art",
    description: "Colorful peacock showpiece made from hand-blown glass.",
    price: 750,
    imageUrl: "glass-peacock.jpg",
  },
  {
    name: "Bamboo Wind Chime",
    category: "Eco Friendly",
    description: "Handmade bamboo wind chime, perfect for home decor.",
    price: 350,
    imageUrl: "bamboo-windchime.jpg",
  },
  {
    name: "Miniature Village Set",
    category: "Miniatures",
    description: "Detailed miniature village house set made from clay and fiber.",
    price: 980,
    imageUrl: "village-miniatures.jpg",
  },
  {
    name: "Resin Buddha Idol",
    category: "Spiritual Decor",
    description: "Peaceful meditating Buddha resin statue for your meditation space.",
    price: 520,
    imageUrl: "resin-buddha.jpg",
  },
  {
    name: "Wrought Iron Musician Set",
    category: "Metal Crafts",
    description: "Traditional Rajasthani musician figures crafted in wrought iron.",
    price: 800,
    imageUrl: "wrought-iron-musicians.jpg",
  },
  {
    name: "Macrame Wall Hanging",
    category: "Textile Art",
    description: "Boho-style macrame wall hanging made with natural cotton.",
    price: 400,
    imageUrl: "macrame-wall-hanging.jpg",
  },
  {
    name: "Paper Quilling Frame",
    category: "Paper Art",
    description: "Beautiful floral quilling design framed in a wooden frame.",
    price: 320,
    imageUrl: "quilling-frame.jpg",
  },
  {
    name: "Stone Painted Ganesha",
    category: "Folk Art",
    description: "River stone hand-painted with a vibrant Ganesha motif.",
    price: 390,
    imageUrl: "painted-ganesha-stone.jpg",
  },
];

const UploadShowpieces = () => {
  const handleUpload = async () => {
    const showpieceCollection = collection(db, "showpieces");
    try {
      for (let item of showpieceProducts) {
        const docRef = await addDoc(showpieceCollection, item);
        console.log(`✅ ${item.name} uploaded with ID: ${docRef.id}`);
      }
      alert("🎉 All showpieces uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Showpieces to Firestore</h2>
      <button onClick={handleUpload} style={{ marginBottom: "2rem" }}>
        Upload Showpieces
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {showpieceProducts.map((item, index) => (
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
            <p><strong>Category:</strong> {item.category}</p>
            <p>{item.description}</p>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadShowpieces;
