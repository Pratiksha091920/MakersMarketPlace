import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthCheck from "./components/AuthCheck";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const AboutUs = lazy(() => import("./pages/Aboutus"));
const Pickles = lazy(() => import("./pages/Pickles"));
const Papads = lazy(() => import("./pages/papad"));
const Jewelry = lazy(() => import("./pages/Jewelary"));
const Jams = lazy(() => import("./pages/jams"));
const Clothes = lazy(() => import("./pages/clothes"));
const Sweets = lazy(() => import("./pages/sweets"));
const Showpieces = lazy(() => import("./pages/showpieces"));
const Cart = lazy(() => import("./pages/cart"));
const Wishlist = lazy(() => import("./pages/wishlist"));
const Profile = lazy(() => import("./pages/profile"));
const Checkout = lazy(() => import("./pages/checkout"));
const Orders = lazy(() => import("./pages/orders"));

// Upload Components (not lazy)
import UploadPickles from "./components/uploadpickles";
import UploadPapads from "./components/uploadpapad";
import UploadHandmadeJewelry from "./components/uploadjewelary";
import UploadJams from "./components/uploadjams";
import UploadClothes from "./components/uploadclothes";
import UploadSweets from "./components/uploadsweets";
import UploadShowpieces from "./components/uploadshowpieces";
import UploadHandmadeBags from "./components/uploadhandmadebags"; // ✅ NEW IMPORT

// Check if authenticated
const auth = getAuth();
const isAuthenticated = () => !!auth.currentUser || !!localStorage.getItem("user");

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AuthCheck />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/pickles" element={<Pickles />} />
              <Route path="/product/papad" element={<Papads />} />
              <Route path="/product/jewelry" element={<Jewelry />} />
              <Route path="/product/jams" element={<Jams />} />
              <Route path="/product/clothes" element={<Clothes />} />
              <Route path="/product/sweets" element={<Sweets />} />
              <Route path="/product/showpiece" element={<Showpieces />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Upload Routes (optional to protect) */}
            <Route path="/upload-pickles" element={<UploadPickles />} />
            <Route path="/upload-papads" element={<UploadPapads />} />
            <Route path="/upload-jewelry" element={<UploadHandmadeJewelry />} />
            <Route path="/upload-jams" element={<UploadJams />} />
            <Route path="/upload-clothes" element={<UploadClothes />} />
            <Route path="/upload-sweets" element={<UploadSweets />} />
            <Route path="/upload-showpieces" element={<UploadShowpieces />} />
            <Route path="/upload-handmade-bags" element={<UploadHandmadeBags />} /> {/* ✅ NEW ROUTE */}

            {/* 404 Fallback */}
            <Route path="*" element={<div>404 - Page not found</div>} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
