import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const handmadeBags = [
  {
    name: "Jute Tote Bag",
    category: "Eco-Friendly",
    description: "Stylish jute tote bag with natural fiber handles.",
    price: 550,
    imageUrl: "jute-tote.jpg",
  },
  {
    name: "Canvas Sling Bag",
    category: "Casual Wear",
    description: "Trendy handmade sling bag with printed canvas material.",
    price: 620,
    imageUrl: "canvas-sling.jpg",
  },
  {
    name: "Crochet Clutch",
    category: "Hand-Knitted",
    description: "Beautifully crocheted clutch bag with zip closure.",
    price: 480,
    imageUrl: "crochet-clutch.jpg",
  },
  {
    name: "Beaded Evening Purse",
    category: "Party Wear",
    description: "Elegant evening purse decorated with hand-stitched beads.",
    price: 870,
    imageUrl: "beaded-purse.jpg",
  },
  {
    name: "Patchwork Shoulder Bag",
    category: "Bohemian",
    description: "Colorful patchwork shoulder bag with a spacious interior.",
    price: 690,
    imageUrl: "patchwork-shoulder.jpg",
  },
  {
    name: "Handloom Cotton Bag",
    category: "Traditional",
    description: "Cotton bag made using handloom techniques with tribal patterns.",
    price: 530,
    imageUrl: "handloom-cotton.jpg",
  },
  {
    name: "Leatherette Bucket Bag",
    category: "Chic",
    description: "Vegan leather bucket bag with drawstring closure.",
    price: 740,
    imageUrl: "leatherette-bucket.jpg",
  },
  {
    name: "Macrame Pouch",
    category: "Boho",
    description: "Hand-knotted macrame pouch with a minimalist look.",
    price: 410,
    imageUrl: "macrame-pouch.jpg",
  },
  {
    name: "Kalamkari Print Bag",
    category: "Ethnic",
    description: "Hand-painted Kalamkari print bag with traditional designs.",
    price: 600,
    imageUrl: "kalamkari-bag.jpg",
  },
  {
    name: "Quilted Handbag",
    category: "Utility",
    description: "Soft quilted handbag with compartments and zipper.",
    price: 720,
    imageUrl: "quilted-handbag.jpg",
  },
];

const UploadHandmadeBags = () => {
  const handleUpload = async () => {
    const bagCollection = collection(db, "handmadeBags");
    try {
      for (let item of handmadeBags) {
        const docRef = await addDoc(bagCollection, item);
        console.log(`✅ ${item.name} uploaded with ID: ${docRef.id}`);
      }
      alert("🎉 All handmade bags uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Handmade Bags to Firestore</h2>
      <button onClick={handleUpload} style={{ marginBottom: "2rem" }}>
        Upload Handmade Bags
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {handmadeBags.map((item, index) => (
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

export default UploadHandmadeBags;
