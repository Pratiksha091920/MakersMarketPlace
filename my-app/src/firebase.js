// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD267uwTvc2JngjHsOIjNbs7Zh8bRv9AIQ",
  authDomain: "e-commerse-web-app-85971.firebaseapp.com",
  projectId: "e-commerse-web-app-85971",
  storageBucket: "e-commerse-web-app-85971.firebasestorage.app",
  messagingSenderId: "153839014271",
  appId: "1:153839014271:web:169f5ebba82a798c3a0a4a",
  measurementId: "G-PBR8L7CKX7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
