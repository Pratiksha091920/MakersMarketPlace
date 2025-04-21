import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

// Upload Components (Not Lazy Loaded)
import UploadPickles from "./components/uploadpickles";
import UploadPapads from "./components/uploadpapad";
import UploadHandmadeJewelry from "./components/uploadjewelary";
import UploadJams from "./components/uploadjams";
import UploadClothes from "./components/uploadclothes";
import UploadSweets from "./components/uploadsweets";
import UploadShowpieces from "./components/uploadshowpieces";

const auth = getAuth();
const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem("user");
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Protected Product Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/pickles" element={<Pickles />} />
              <Route path="/product/papad" element={<Papads />} />
              <Route path="/product/jewelry" element={<Jewelry />} />
              <Route path="/product/jams" element={<Jams />} />
              <Route path="/product/clothes" element={<Clothes />} />
              <Route path="/product/sweets" element={<Sweets />} />
              <Route path="/product/showpieces" element={<Showpieces />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
            </Route>

            {/* Upload Routes (Optional: Protect these too if needed) */}
            <Route path="/upload-pickles" element={<UploadPickles />} />
            <Route path="/upload-papads" element={<UploadPapads />} />
            <Route path="/upload-jewelry" element={<UploadHandmadeJewelry />} />
            <Route path="/upload-jams" element={<UploadJams />} />
            <Route path="/upload-clothes" element={<UploadClothes />} />
            <Route path="/upload-sweets" element={<UploadSweets />} />
            <Route path="/upload-showpieces" element={<UploadShowpieces />} />

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
