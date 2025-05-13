import React, { useState } from "react";
import {
  Shield,
  User,
  Mail,
  Lock,
  CreditCard,
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import "./Signup.css";

const AadharCardInput = ({ value, onChange, error }) => {
  const handleChange = (e, index) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");

    if (newValue.length > 4) return;

    const parts = value.split(" ");
    parts[index] = newValue;

    const newFullValue = parts.join(" ").trim();
    onChange(newFullValue);

    if (newValue.length === 4 && index < 2) {
      const nextInput =
        e.target.parentElement.nextElementSibling.querySelector("input");
      if (nextInput) nextInput.focus();
    }
  };

  const getPart = (index) => {
    const parts = value.split(" ");
    return parts[index] || "";
  };

  return (
    <div>
      <div className="aadhar-input-container">
        <div className="aadhar-input-group">
          <input
            value={getPart(0)}
            onChange={(e) => handleChange(e, 0)}
            placeholder="XXXX"
            maxLength={4}
            className="aadhar-input"
          />
        </div>
        <div className="aadhar-input-group">
          <input
            value={getPart(1)}
            onChange={(e) => handleChange(e, 1)}
            placeholder="XXXX"
            maxLength={4}
            className="aadhar-input"
          />
        </div>
        <div className="aadhar-input-group">
          <input
            value={getPart(2)}
            onChange={(e) => handleChange(e, 2)}
            placeholder="XXXX"
            maxLength={4}
            className="aadhar-input"
          />
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

const SignupForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    gender: "",
    password: "",
    confirmPassword: "",
    age: "",
    aadharCard: "",
    panCard: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleAadharChange = (value) => {
    setFormData({
      ...formData,
      aadharCard: value,
    });
  };

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase();
    setFormData({
      ...formData,
      panCard: value,
    });
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    return (
      password.length >= 8 &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecial
    );
  };

  const validateAadhar = (aadhar) => {
    const digitsOnly = aadhar.replace(/\s/g, "");
    return digitsOnly.length === 12 && /^\d+$/.test(digitsOnly);
  };

  const validatePan = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.username) {
        newErrors.username = "Mobile number is required";
      } else if (!validateMobile(formData.username)) {
        newErrors.username = "Please enter a valid Indian mobile number";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.fullName || formData.fullName.length < 3) {
        newErrors.fullName = "Full name must be at least 3 characters";
      }

      if (!formData.gender) {
        newErrors.gender = "Please select your gender";
      }
    }

    if (stepNumber === 2) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password =
          "Password must have 8+ characters with uppercase, lowercase, number, and special character";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.age) {
        newErrors.age = "Age is required";
      } else {
        const ageNum = parseInt(formData.age);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
          newErrors.age = "Age must be between 18 and 100";
        }
      }
    }

    if (stepNumber === 3) {
      if (!validateAadhar(formData.aadharCard)) {
        newErrors.aadharCard = "Aadhar card must be 12 digits";
      }

      if (!validatePan(formData.panCard)) {
        newErrors.panCard =
          "Please enter a valid PAN card number (e.g., ABCDE1234F)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      console.log(formData);
      alert("Registration submitted successfully!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="card-header">
          <div className="header-content">
            <div className="header-title">
              <Shield className="icon-shield" />
              <h2>Secure Registration Portal</h2>
            </div>
            <div className="step-indicator">
              Step {step} of {totalSteps}
            </div>
          </div>
          <p className="header-description">
            All information is encrypted and securely stored
          </p>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-content">
            {step === 1 && (
              <div className="form-section">
                <div className="section-title">
                  <User className="section-icon" />
                  <h3>Personal Information</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="username">Mobile Number (Username)</label>
                  <div className="input-with-prefix">
                    <input
                      id="username"
                      name="username"
                      placeholder="9876543210"
                      value={formData.username}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: {
                            name: "username",
                            value: value,
                          },
                        });
                      }}
                      maxLength={10}
                    />
                  </div>
                  <p className="input-description">
                    Your mobile number will be your username
                  </p>
                  {errors.username && (
                    <p className="error-message">{errors.username}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    placeholder="As per official documents"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && (
                    <p className="error-message">{errors.fullName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={() => handleRadioChange("male")}
                      />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={() => handleRadioChange("female")}
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="other"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={() => handleRadioChange("other")}
                      />
                      <label htmlFor="other">Other</label>
                    </div>
                  </div>
                  {errors.gender && (
                    <p className="error-message">{errors.gender}</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-section">
                <div className="section-title">
                  <Lock className="section-icon" />
                  <h3>Security Information</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-icon">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="input-description">
                    Must contain at least 8 characters, including uppercase,
                    lowercase, number, and special character
                  </p>
                  {errors.password && (
                    <p className="error-message">{errors.password}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-with-icon">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="error-message">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <div className="input-with-icon">
                    <input
                      id="age"
                      name="age"
                      placeholder="Must be 18 or above"
                      value={formData.age}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: {
                            name: "age",
                            value: value,
                          },
                        });
                      }}
                    />
                  </div>
                  {errors.age && <p className="error-message">{errors.age}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-section">
                <div className="section-title">
                  <CreditCard className="section-icon" />
                  <h3>Identity Verification</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="aadharCard">Aadhar Card Number</label>
                  <AadharCardInput
                    value={formData.aadharCard}
                    onChange={handleAadharChange}
                    error={errors.aadharCard}
                  />
                  <p className="input-description">
                    Enter your 12-digit Aadhar number in format XXXX XXXX XXXX
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="panCard">PAN Card Number</label>
                  <input
                    id="panCard"
                    name="panCard"
                    placeholder="ABCDE1234F"
                    value={formData.panCard}
                    onChange={handlePanChange}
                    maxLength={10}
                  />
                  <p className="input-description">
                    Format: AAAAA0000A (5 letters, 4 numbers, 1 letter)
                  </p>
                  {errors.panCard && (
                    <p className="error-message">{errors.panCard}</p>
                  )}
                </div>

                <div className="security-notice">
                  <div className="notice-content">
                    <Shield className="notice-icon" />
                    <div>
                      <h4>Important Notice</h4>
                      <p>
                        By submitting this form, you confirm that all
                        information provided is accurate and belongs to you.
                        Providing false information may lead to legal
                        consequences under applicable laws.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card-footer">
            {step > 1 ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={prevStep}
              >
                <ChevronLeft className="btn-icon" /> Previous
              </button>
            ) : (
              <div></div>
            )}

            {step < totalSteps ? (
              <button type="button" className="btn-primary" onClick={nextStep}>
                Next <ChevronRight className="btn-icon" />
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Complete Registration <Check className="btn-icon" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
