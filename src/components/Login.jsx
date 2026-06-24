import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash, FaShieldAlt, FaChartLine, FaGlobe } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Side - Login Form */}
        <div className="login-left">
          <div className="login-content">
            <div className="login-header">
              <div className="logo">
                <span className="logo-icon">✈️</span>
                <span className="logo-text">PixiYatra</span>
              </div>
              <h1>Manage. Monitor. Grow Your Travel Business</h1>
              <p className="subtitle">
                Securely access your admin panel to manage bookings, users, and your travel platform.
              </p>
            </div>

            <div className="login-form-container">
              <div className="welcome-section">
                <h2>Welcome Back!</h2>
                <p>Login to continue to your admin account</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label>
                    <FaEnvelope className="input-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaLock className="input-icon" />
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forget Password?
                  </Link>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? (
                    <span className="spinner"></span>
                  ) : (
                    'Login'
                  )}
                </button>

                <div className="divider">
                  <span>OR CONTINUE WITH</span>
                </div>

                <button type="button" className="google-btn">
                  <FaGoogle className="google-icon" />
                  Continue with Google
                </button>
              </form>
            </div>

            <div className="login-footer">
              <p>© 2024 Travoa. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Features with Orange-Yellow Gradient */}
        <div className="login-right">
          <div className="features-container">
            <div className="features-header">
              <h2>Welcome to Travoa</h2>
              <p>Your complete travel management solution</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon secure">
                  <FaShieldAlt />
                </div>
                <div className="feature-text">
                  <h3>Secure Access</h3>
                  <p>Your data is safe with us</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon insights">
                  <FaChartLine />
                </div>
                <div className="feature-text">
                  <h3>Real-time Insights</h3>
                  <p>Track and grow your business</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon global">
                  <FaGlobe />
                </div>
                <div className="feature-text">
                  <h3>Global Reach</h3>
                  <p>Manage bookings worldwide</p>
                </div>
              </div>
            </div>

            <div className="features-footer">
              <div className="testimonial">
                <p>"Travoa has transformed how we manage our travel business. Highly recommended!"</p>
                <div className="testimonial-author">
                  <img src="https://via.placeholder.com/40" alt="User" />
                  <div>
                    <strong>Sarah Johnson</strong>
                    <span>Travel Agency Owner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;