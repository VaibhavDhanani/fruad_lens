"use client"

import { useState } from "react"
import { Shield, Lock, Eye, EyeOff } from "lucide-react"
import "./login.css"

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Validate mobile number (username)
  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(mobile)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username) {
      newErrors.username = "Mobile number is required"
    } else if (!validateMobile(formData.username)) {
      newErrors.username = "Please enter a valid Indian mobile number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log(formData)
      alert("Login successful!")
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <div className="header-title">
            <Shield className="icon-shield" />
            <h2>Secure Login Portal</h2>
          </div>
          <p className="header-description">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-content">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="username">Mobile Number (Username)</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">+91</span>
                  <input
                    id="username"
                    name="username"
                    placeholder="9876543210"
                    value={formData.username}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      handleChange({
                        target: {
                          name: "username",
                          value: value,
                        },
                      })
                    }}
                    maxLength={10}
                  />
                </div>
                {errors.username && <p className="error-message">{errors.username}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon-and-button">
                  <Lock className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="password-icon" /> : <Eye className="password-icon" />}
                  </button>
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>
              </div>

              <div className="security-badge">
                <Shield className="badge-icon" />
                <p>Your connection to this site is secure</p>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button type="submit" className="btn-primary">
              Login 
            </button>
            <p className="signup-link">
              Don't have an account? <a href="/signup">Register Now</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
