import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only redirect from the homepage or auth page
      if (location.pathname === "/") {
        if (user) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  return null;
};

export default AuthCheck;
