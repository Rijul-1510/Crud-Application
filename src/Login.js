import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    }
    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm(formData);
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // "Login successful!"
        navigate('/fetchdata');
      } else {
        alert(result.error); // "New user. Please sign up first."
      }
    } catch (error) {
      alert('Server error. Please try again later.');
      console.error(error);
    }
  }
};



  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="login-two-panel">
      <div className="login-left">
        <h1 className="logo">Login</h1>
        <div className="underlined"></div>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="label">Email:</label>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className={errors.email ? 'input error-border' : 'input'}
            />
          </div>
          {errors.email && <span className="error">{errors.email}</span>}

          <label className="label">Password:</label>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className={errors.password ? 'input error-border' : 'input'}
            />
          </div>
          {errors.password && <span className="error">{errors.password}</span>}

          <div className="forgot-passwords">
            Forgot Password?{' '}
            <span
              className="clickable"
              onClick={() => {
                if (!formData.email.trim()) {
                  alert('Please enter your email first before resetting password.');
                } else {
                  navigate('/forgot-password', { state: { email: formData.email } });
                }
              }}
            >
              Click Here!
            </span>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn">Login</button>
            <button type="button" className="btn" onClick={handleSignUpClick}>SignUp</button>
          </div>
        </form>
      </div>

      <div className="login-right">
        <video autoPlay muted loop className="video-bg">
          <source src="/travel.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default Login;
