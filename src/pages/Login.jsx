import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { 
  FaEnvelope, 
  FaLock, 
  FaGoogle, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt, 
  FaChartLine, 
  FaGlobe,
  FaUser,
  FaExclamationTriangle,
  FaWifi,
  FaServer,
  FaCheckCircle
} from 'react-icons/fa';
import authService from '../api/auth';
import API_CONFIG from '../api/config';
import { requestFCMToken } from '../firebase/firebase';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Login Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>⚠️ Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [apiStatus, setApiStatus] = useState('checking');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [fcmStatus, setFcmStatus] = useState('Checking...');
  const navigate = useNavigate();

  // Check API connection and FCM on mount
  useEffect(() => {
    checkApiConnection();
    checkFCMStatus();
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await fetch(API_CONFIG.baseURL + API_CONFIG.endpoints.login, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setApiStatus('online');
    } catch (error) {
      setApiStatus('offline');
      console.error('API is offline:', error.message);
    }
  };

  const checkFCMStatus = async () => {
    try {
      // Check if notification permission is granted
      if ('Notification' in window) {
        const permission = Notification.permission;
        if (permission === 'granted') {
          setFcmStatus('✅ FCM Ready');
        } else if (permission === 'denied') {
          setFcmStatus('❌ FCM Blocked');
        } else {
          setFcmStatus('⚠️ FCM Not Requested');
        }
      } else {
        setFcmStatus('❌ FCM Not Supported');
      }
    } catch (error) {
      console.error('FCM status check error:', error);
      setFcmStatus('❌ FCM Error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setErrorType('');
    setValidationErrors({});
    setLoading(true);
    

    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      setErrorType('validation');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      setErrorType('validation');
      setLoading(false);
      return;
    }

    try {
      setLoginAttempts(prev => prev + 1);
      
      const result = await authService.login(identifier.trim(), password);
      
      
      if (result.success) {
        
        const userRole = authService.getUserRole();
        
        if (!userRole || userRole !== 'Veichle_Booking_Controller_Admin') {
          console.error('Invalid role:', userRole);
          setError(`You are not authorized. Your role: ${userRole || 'Unknown'}. Required: Vehicle Booking Controller Admin.`);
          setErrorType('unauthorized');
          authService.clearAll();
          setLoading(false);
          return;
        }

        // FCM token is automatically registered during login
        
        setLoading(false);
        navigate('/dashboard', { replace: true });
        
      } else {
        console.error('Login failed:', result);
        
        if (result.code === 'NETWORK_ERROR' || result.code === 'NO_RESPONSE') {
          setError('🔌 Cannot connect to server. Please make sure the backend server is running.');
          setErrorType('network');
        } else if (result.code === 'CONNECTION_CLOSED') {
          setError('🔌 Connection to server was closed. Please try again.');
          setErrorType('network');
        } else if (result.code === 'TIMEOUT') {
          setError('⏱️ Request timed out. Please check your connection.');
          setErrorType('timeout');
        } else if (result.code === 'NOT_FOUND') {
          setError('❌ API endpoint not found. Please check the URL configuration.');
          setErrorType('config');
        } else if (result.code === 'SERVER_ERROR') {
          setError('⚠️ Server error. Please try again later.');
          setErrorType('server');
        } else if (result.code === 'ACCOUNT_LOCKED') {
          setError('🔒 Account locked. Please try again later or contact support.');
          setErrorType('locked');
        } else if (result.code === 'FORBIDDEN') {
          setError('⛔ You are not authorized to access Vehicle Booking Controller Admin.');
          setErrorType('unauthorized');
        } else {
          setError(`❌ ${result.message || 'Login failed. Please check your credentials.'}`);
          setErrorType('auth');
        }
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      setError('An unexpected error occurred. Please try again.');
      setErrorType('unknown');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getErrorIcon = () => {
    switch(errorType) {
      case 'network':
        return <FaWifi className="error-icon" />;
      case 'server':
      case 'config':
        return <FaServer className="error-icon" />;
      default:
        return <FaExclamationTriangle className="error-icon" />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="login-container">
        <div className="login-wrapper">
          {/* Left Side - Login Form */}
          <div className="login-left">
            <div className="login-content">
              <div className="login-header">
                <div className="logo">
                  <span className="logo-text">PixiYatra</span>
                </div>
                
                {/* API Status Indicator */}
                <div className={`api-status ${apiStatus}`}>
                  {apiStatus === 'online' ? (
                    <>
                      <FaCheckCircle /> API Connected
                    </>
                  ) : apiStatus === 'checking' ? (
                    <>
                      <span className="spinner-small"></span> Checking API...
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle /> API Offline
                    </>
                  )}
                </div>

                {/* FCM Status Indicator */}
                <div className="fcm-status">
                  <span className="fcm-icon">📱</span>
                  <span className="fcm-text">{fcmStatus}</span>
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
                  {loginAttempts > 0 && (
                    <p className="login-attempts">Login attempts: {loginAttempts}</p>
                  )}
                </div>

                {/* Error Message with Icon */}
                {error && (
                  <div className={`error-message ${errorType}`}>
                    {getErrorIcon()}
                    <span>{error}</span>
                  </div>
                )}

                {/* Network troubleshooting */}
                {errorType === 'network' && (
                  <div className="troubleshoot-box">
                    <h4>💡 Troubleshooting Tips:</h4>
                    <ul>
                      <li>Make sure the backend server is running on <strong>192.168.31.76:8000</strong></li>
                      <li>Check if the API URL in <strong>.env</strong> file is correct</li>
                      <li>Verify your network connection to <strong>192.168.31.76</strong></li>
                      <li>Check if CORS is enabled on the server</li>
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label>
                      <FaUser className="input-icon" />
                      Email or Phone Number
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setError('');
                        setErrorType('');
                        setValidationErrors({});
                      }}
                      placeholder="Enter your email or phone number"
                      className={validationErrors.identifier ? 'error' : ''}
                      autoComplete="username"
                      required
                    />
                    <span className="input-hint">
                      Enter your registered email or phone number
                    </span>
                    {validationErrors.identifier && (
                      <span className="field-error">
                        {Array.isArray(validationErrors.identifier) 
                          ? validationErrors.identifier[0] 
                          : typeof validationErrors.identifier === 'string'
                            ? validationErrors.identifier
                            : 'Invalid identifier'}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <FaLock className="input-icon" />
                      Password
                    </label>
                    <div className={`password-input-wrapper ${validationErrors.password ? 'error' : ''}`}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                          setErrorType('');
                          setValidationErrors({});
                        }}
                        placeholder="Enter your password"
                        autoComplete="current-password"
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
                    {validationErrors.password && (
                      <span className="field-error">
                        {Array.isArray(validationErrors.password) 
                          ? validationErrors.password[0] 
                          : typeof validationErrors.password === 'string'
                            ? validationErrors.password
                            : 'Invalid password'}
                      </span>
                    )}
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
                      Forgot Password?
                    </Link>
                  </div>

                  <button type="submit" className="login-btn" disabled={loading || apiStatus === 'offline'}>
                    {loading ? (
                      <span className="spinner"></span>
                    ) : apiStatus === 'offline' ? (
                      'Server Unavailable'
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
                <p>© 2024 PixiYatra. All rights reserved.</p>
              </div>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="login-right">
            <div className="features-container">
              <div className="features-header">
                <h2>Welcome to PixiYatra</h2>
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
                  <p>"PixiYatra has transformed how we manage our travel business. Highly recommended!"</p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Login;