import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const jewelryItems = [
  {
    name: "Pearl Necklace",
    description: "Elegant handmade necklace with freshwater pearls.",
    price: 1200,
    imageUrl: "/jewelry/pearl-necklace.jpg"
  },
  {
    name: "Beaded Bracelet",
    description: "Colorful beads with elastic string, perfect for casual wear.",
    price: 450,
    imageUrl: "/jewelry/beaded-bracelet.jpg"
  },
  {
    name: "Silver Earrings",
    description: "Oxidized silver dangle earrings with intricate design.",
    price: 800,
    imageUrl: "/jewelry/silver-earrings.jpg"
  },
  {
    name: "Terracotta Set",
    description: "Hand-painted terracotta necklace and earring set.",
    price: 1000,
    imageUrl: "/jewelry/terracotta-set.jpg"
  },
  {
    name: "Thread Anklet",
    description: "Colorful anklet made with cotton thread and beads.",
    price: 300,
    imageUrl: "/jewelry/thread-anklet.jpg"
  },
  {
    name: "Stone Ring",
    description: "Adjustable ring with a turquoise stone centerpiece.",
    price: 600,
    imageUrl: "/jewelry/stone-ring.jpg"
  },
  {
    name: "Kundan Choker",
    description: "Traditional kundan choker with gold-tone finish.",
    price: 1500,
    imageUrl: "/jewelry/kundan-choker.jpg"
  },
  {
    name: "Shell Earrings",
    description: "Handmade earrings using real sea shells.",
    price: 350,
    imageUrl: "/jewelry/shell-earrings.jpg"
  },
  {
    name: "Wire-Wrapped Pendant",
    description: "Artistic pendant made with copper wire and crystals.",
    price: 900,
    imageUrl: "/jewelry/wire-pendant.jpg"
  },
  {
    name: "Fabric Brooch",
    description: "Colorful brooch made from upcycled fabric.",
    price: 200,
    imageUrl: "/jewelry/fabric-brooch.jpg"
  },
];

const UploadJewelry = () => {
  const handleUpload = async () => {
    try {
      const collectionRef = collection(db, "jewelary");

      for (const item of jewelryItems) {
        await addDoc(collectionRef, {
          ...item,
          addedAt: new Date(),
        });
      }

      alert("✅ Handmade jewelry items uploaded successfully!");
    } catch (error) {
      console.error("❌ Error uploading items:", error);
      alert("Upload failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Handmade Jewelry Items</h2>
      <button onClick={handleUpload}>Upload Jewelry</button>
    </div>
  );
};

export default UploadJewelry;
