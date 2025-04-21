import React, { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Check your inbox.");
            setError("");
        } catch (err) {
            setError("Failed to send password reset email. Check your email address.");
            setMessage("");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2>Forgot Password</h2>
                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}
                <form onSubmit={handleResetPassword}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <button type="submit" className="reset-btn">Send Reset Email</button>
                </form>
                <p><Link to="/login">Back to Login</Link></p>
            </div>
        </div>
    );
};

export default ForgotPassword;
