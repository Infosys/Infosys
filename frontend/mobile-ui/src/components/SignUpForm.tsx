// SignUpForm.tsx
// User registration form for the Citizen/Agent portal. Handles input, validation, and submission.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import '../styles/SignUpForm.css';
import { validateSignUpForm } from '../validations/signUpValidations';
import { useSignUpForm } from '../context/SignUpFormContext';
import type { SignUpFormErrors } from '../models/signUpFormModel';
import { SignUpService } from '../services/signUpService';
import type { AlertType } from '../app/models/AlertType.model';
import { NotificationPopup } from '../app/components/Popup/NotificationPopup';

// Main sign up form component
export default function SignUpForm() {
  // React Router navigation hook
  const navigate = useNavigate();
  // Destructure form state and handlers from context
  const {
    signupType,
    setSignupType,
    form,
    setForm,
    errors,
    setErrors,
    touched,
    setTouched,
    resetForm,
    // userInfo,
    setUserInfo,
  } = useSignUpForm();

  const [popup, setPopup] = useState<{
    type: AlertType;
    open: boolean;
    title: string;
    message: string;
    duration: number;
  }>({
    type: 'warning',
    open: false,
    title: '',
    message: '',
    duration: 3000,
  });

  function showErrorPopup(
    message: string,
    duration = 3000,
    type: AlertType = 'warning',
    title: string = 'Warning'
  ) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type,
        open: true,
        title,
        message,
        duration,
      });
    }, 10);
  }

  // Set default signup type to CITIZEN if not set
  useEffect(() => {
    if (!signupType) setSignupType('CITIZEN');
  }, [signupType, setSignupType]);

  // Handle input change for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  // Handle blur event for form fields (mark as touched and validate)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validateSignUpForm({ ...form, [e.target.name]: e.target.value }));
  };

  // Handle form submission: validate, submit to backend, and navigate on success
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: SignUpFormErrors = validateSignUpForm(form);
    setErrors(validationErrors);
    setTouched({
      username: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
      password: true,
      passwordConfirm: true,
    });
    if (Object.keys(validationErrors).length === 0) {
      // Prepare payload with selected role
      const payload = { ...form, role: signupType };
      // Submit registration to backend
      const response = await SignUpService.signUp(payload);
      if (response.success) {
        setUserInfo(response.data);
        resetForm();
        // Show success alert and navigate to login
        if (response.data.role == 'AGENT') {
          // alert(`AGENT User ID: ${response.data.email}, Signup successful!`);
          navigate('/login');
        } else if (response.data.role == 'CITIZEN') {
          // alert(`CITIZEN User ID: ${response.data.email}, Signup successful!`);
          sessionStorage.setItem(
            'signupSuccessMessage',
            'Signup successful! Please login to continue.'
          );
          navigate('/login');
        }
      } else {
        showErrorPopup(response.message || 'Signup failed');
      }
    }
  };

  // Navigate to login page
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Render sign up form UI
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <h2 className="signup-title">Sign Up</h2>
          <div className="form-group">
            <label>
              Username <span className="required">*</span>
              <span> :</span>
              <InfoOutlinedIcon className="info-icon" fontSize="small" />
            </label>
            <input
              id="signup-username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="username"
              className={`input-field${
                errors.username && touched.username ? ' input-error' : ''
              }`}
            />
            {errors.username && touched.username && (
              <div className="error">{errors.username}</div>
            )}
          </div>
          <div className="form-group">
            <label>
              First Name <span className="required">*</span>
              <span> :</span>
              <InfoOutlinedIcon className="info-icon" fontSize="small" />
            </label>
            <input
              id="signup-firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="given-name"
              // className={errors.firstName && touched.firstName ? "input-error" : "input-field"}
              className={`input-field${
                errors.firstName && touched.firstName ? ' input-error' : ''
              }`}
            />
            {errors.firstName && touched.firstName && (
              <div className="error">{errors.firstName}</div>
            )}
          </div>
          <div className="form-group">
            <label>
              Last Name <span className="required">*</span>
              <span> :</span>
              <InfoOutlinedIcon className="info-icon" fontSize="small" />
            </label>
            <input
              id="signup-lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="family-name"
              // className={errors.lastName && touched.lastName ? "input-error" : "input-field"}
              className={`input-field${
                errors.lastName && touched.lastName ? ' input-error' : ''
              }`}
            />
            {errors.lastName && touched.lastName && (
              <div className="error">{errors.lastName}</div>
            )}
          </div>
          <div className="form-group">
            <label>
              Phone Number <span className="required">*</span>
              <span> :</span>
            </label>
            <input
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              // className={errors.phoneNumber && touched.phoneNumber ? "input-error" : "input-field"}
              className={`input-field${
                errors.phoneNumber && touched.phoneNumber ? ' input-error' : ''
              }`}
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <div className="error">{errors.phoneNumber}</div>
            )}
          </div>
          <div className="form-group">
            <label>
              Email Address <span className="required">*</span>
              <span> :</span>
              <InfoOutlinedIcon className="info-icon" fontSize="small" />
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="email"
              // className={errors.email && touched.email ? "input-error" : "input-field"}
              className={`input-field${
                errors.email && touched.email ? ' input-error' : ''
              }`}
            />
            {errors.email && touched.email && <div className="error">{errors.email}</div>}
          </div>
          {/* <div className="form-group">
          <label>
            Password <span className="required">*</span>
            <span> :</span>
            <InfoOutlinedIcon className="info-icon" fontSize="small" />
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="new-password"
            // className={errors.password && touched.password ? "input-error" : "input-field"}
            className={`input-field${errors.password && touched.password ? " input-error" : ""}`}
          />
          {errors.password && touched.password && (
            <div className="error">{errors.password}</div>
          )}
        </div>
        <div className="password-rules">
          <div className="password-rules-title">Password must contain :</div>
          <ul>
            <li>✓ Upper case letter</li>
            <li>✓ Number</li>
            <li>✓ Special Character</li>
            <li>✓ Minimum of 8 Characters</li>
          </ul>
        </div>
        <div className="form-group">
          <label>
            Password Confirmation <span className="required">*</span>
            <span> :</span>
          </label>
          <input
            name="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="new-password"
            // className={errors.passwordConfirm && touched.passwordConfirm ? "input-error" : "input-field"}
            className={`input-field${errors.passwordConfirm && touched.passwordConfirm ? " input-error" : ""}`}
          />
          {errors.passwordConfirm && touched.passwordConfirm && (
            <div className="error">{errors.passwordConfirm}</div>
          )}
        </div> */}
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
          <div className="login-row">
            <span className="login-link" onClick={handleLoginClick}>
              Already have an account? Login
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
