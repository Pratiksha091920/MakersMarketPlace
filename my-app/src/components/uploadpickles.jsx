import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const pickleProducts = [
  {
    name: "Spicy Mango Pickle",
    description: "Made with raw mangoes and traditional spices.",
    price: 150,
    imageUrl: "Mango-pickle.jpg",
  },
  {
    name: "Lemon Pickle",
    description: "Tangy and zesty lemon pickle with mustard flavor.",
    price: 130,
    imageUrl: "lemon-pickle.jpg",
  },
  {
    name: "Mixed Vegetable Pickle",
    description: "Carrot, cauliflower, and turnip in one spicy mix.",
    price: 160,
    imageUrl: "mixed-vegetable.jpg",
  },
  {
    name: "Green Chilli Pickle",
    description: "Hot and spicy green chilies pickled in mustard oil.",
    price: 120,
    imageUrl: "green-chilli.jpg",
  },
  {
    name: "Garlic Pickle",
    description: "Flavorful pickle made with garlic and rich spices.",
    price: 140,
    imageUrl: "garlic pickle.jpg",
  },
  {
    name: "Amla Pickle",
    description: "Healthy gooseberry pickle with a tangy twist.",
    price: 110,
    imageUrl: "amla-pickle.jpg",
  },
  {
    name: "Sweet Mango Pickle",
    description: "Sweet and tangy mango pickle, a childhood favorite.",
    price: 150,
    imageUrl: "sweet-mango.jpg",
  },
  {
    name: "Red Chilli Pickle",
    description: "Bold and fiery pickle with whole red chillies.",
    price: 135,
    imageUrl: "",
  },
  {
    name: "Turmeric Pickle",
    description: "Fermented turmeric slices in mustard oil and lemon.",
    price: 125,
    imageUrl: "turmeric.jpg",
  },
];

const UploadPickles = () => {
  const handleUpload = async () => {
    const picklesCollection = collection(db, "pickles");
    try {
      for (let pickle of pickleProducts) {
        const docRef = await addDoc(picklesCollection, pickle);
        console.log(`✅ ${pickle.name} uploaded with ID: ${docRef.id}`);
      }
      alert("🎉 All pickles uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error.message);
    }
  };

  const handleBuyNow = (productName) => {
    alert(`🛒 You clicked Buy Now for: ${productName}`);
    // Future: Navigate to checkout or cart page
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Pickles to Firestore</h2>
      <button onClick={handleUpload} style={{ marginBottom: "2rem" }}>
        Upload Pickles
      </button>

      {/* Preview Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {pickleProducts.map((pickle, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "10px", background: "#fff" }}>
            <img
              src={pickle.imageUrl}
              alt={pickle.name}
              style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px" }}
            />
            <h3>{pickle.name}</h3>
            <p>{pickle.description}</p>
            <p>₹{pickle.price}</p>
            <button onClick={() => handleBuyNow(pickle.name)} style={{ marginTop: "0.5rem" }}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPickles;
