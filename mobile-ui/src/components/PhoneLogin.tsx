// PhoneLogin.tsx
// Phone number login component for the Citizen Portal. Handles phone input, validation, OTP request, and navigation.
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../styles/PhoneLogin.css";
import { useNavigate } from "react-router-dom";
import { PhoneLoginService } from "../services/PhoneLoginService";
import { useSignUpForm } from "../context/SignUpFormContext";

/**
 * PhoneLogin Component
 * Renders a form for phone number login, validates input, requests OTP, and navigates to OTP verification.
 */
const PhoneLogin: React.FC = () => {
  // State for phone input value
  const [phone, setPhone] = useState("");
  // Tracks if input has been touched (for error display)
  const [touched, setTouched] = useState(false);
  // Error message state
  const [error, setError] = useState("");
  // Loading state for async OTP request
  const [loading, setLoading] = useState(false);
  // Navigation hook
  const navigate = useNavigate();
  // Context setters for username and OTP
  const { setUsername, setOtp } = useSignUpForm();

  /**
   * Handle phone input change
   * Updates phone state, marks as touched, and clears error
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setTouched(true);
    setError("");
  };

  /**
   * Handle verify button submit
   * Validates phone number, requests OTP, updates context, and navigates to OTP verification page.
   */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const phoneTrimmed = phone.trim();
    const phoneRegex = /^[0-9]{10}$/;

    // Validate phone input
    if (!phoneTrimmed) {
      setError("Phone Number is required.");
      return;
    }
    if (!phoneRegex.test(phoneTrimmed)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      // Request OTP from backend
      const result = await PhoneLoginService.sendOtp(phoneTrimmed);
      if (result.success && result.data?.otp) {
        setOtp(result.data.otp);
        setUsername(result.data.userInfo.username);
        if (result.data.userInfo) {
          // setUserInfo(result.data.userInfo);
        }
        // Navigate to OTP verification page
        navigate("/otp-verification", { state: { phone: phoneTrimmed } });
      } else {
        setError(result.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to registration page
  const onBack = () => {
    navigate("/register");
  };

  // Navigate to landing page
  const onLanding = () => {
    navigate("/landing-page");
  };

  // Render phone login form UI
  return (
    <div className="phone-login-container">
      <form className="phone-login-card" onSubmit={handleVerify}>
        <h2 className="phone-login-title">Citizen Portal Login</h2>
        <div className="phone-form-group">
          <label>
            Phone Number <span className="required">*</span> <span> :</span>
            <InfoOutlinedIcon className="info-icon" fontSize="small" />
          </label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="phone-input"
            autoComplete="username"
            onBlur={() => setTouched(true)}
            maxLength={10}
            pattern="[0-9]*"
            inputMode="numeric"
            disabled={loading}
          />
          <small className="phone-form-hint">Enter Phone Number used to register</small>
          {error && touched && <div className="phone-error">{error}</div>}
        </div>
        <button type="submit" className="phone-verify-btn" disabled={loading}>
          {loading ? "Sending OTP..." : "Verify"}
        </button>
        <button
          type="button"
          className="back-login-btn"
          onClick={onBack}
        >
          <ArrowBackIcon style={{ verticalAlign: "middle", color: "#c84c03", marginRight: 6 }} />
          <span>New User? Register</span>
        </button>

        <button
          type="button"
          className="back-login-btn"
          onClick={onLanding}
        >
          <ArrowBackIcon style={{ verticalAlign: "middle", color: "#c84c03", marginRight: 6 }} />
          <span>Landing Page</span>
        </button>
      </form>
    </div>
  );
};

export default PhoneLogin;