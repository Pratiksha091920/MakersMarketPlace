import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css"; // Scoped custom CSS

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  // Load Firebase auth user and Firestore user data
  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);

      // Fetch name and email from Firestore
      const fetchUserFromFirestore = async () => {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data()); // { name, email }
          } else {
            setUserData({
              name: currentUser.displayName || "No name set",
              email: currentUser.email,
            });
          }
        } catch (error) {
          console.error("Error fetching Firestore user:", error);
        }
      };

      fetchUserFromFirestore();
    } else {
      navigate("/login");
    }
  }, [auth, db, navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>Your Profile</h2>
        <div className="profile-card">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <button onClick={handleLogout} className="profile-logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
