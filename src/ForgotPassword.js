import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/fetchData');
      const users = await response.json();
      const user = users.find((u) => u.email === email);

      if (user) {
        setEmailVerified(true);
        setError('');
      } else {
        setError('Invalid email ID');
        setEmailVerified(false);
      }
    } catch (err) {
      setError('Failed to verify email');
    }
  };

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError('');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="login-two-panel">
      <div className="login-left">
        <h1 className="logo">Forgot Password</h1>
        <div className="underlined"></div>

        <label className="label">Enter your Email:</label>
        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className={error && !emailVerified ? 'input error-border' : 'input'}
            disabled={emailVerified}
          />
        </div>
        <button className="btn" onClick={handleVerify} disabled={emailVerified}>
          Verify Email
        </button>

        {emailVerified && (
          <>
            <label className="label">New Password:</label>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={error && newPassword === '' ? 'input error-border' : 'input'}
              />
            </div>

            <label className="label">Confirm Password:</label>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={error && confirmPassword === '' ? 'input error-border' : 'input'}
              />
            </div>

            <button className="btn" onClick={handleReset}>
              Reset Password
            </button>
          </>
        )}

        {error && <div className="error">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="forgot-passwords" style={{ marginTop: '1rem' }}>
          Remembered password?{' '}
          <span className="clickable" onClick={() => navigate('/')}>
            Login Here!
          </span>
        </div>
      </div>

      <div className="login-right">
        <video autoPlay muted loop className="video-bg">
          <source src="/travel.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default ForgotPassword;
