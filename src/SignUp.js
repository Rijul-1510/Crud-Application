import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import './SignUp.css';
import { AiFillAlert } from "react-icons/ai";
import { Message } from 'rsuite';
import { useNavigate, useLocation } from 'react-router-dom';

function SignUp({ onBackToLoginClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    circle: '',
    hobbies: [],
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);
  const isEditMode = !!location.state?.initialFormData;

  useEffect(() => {
  if (isEditMode) {
    const initial = location.state.initialFormData;
    setFormData({
      ...initial,
      file: typeof initial.file === 'string' ? initial.file : null,
    });
  }
}, [location.state, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          hobbies: [...formData.hobbies, value],
        });
      } else {
        setFormData({
          ...formData,
          hobbies: formData.hobbies.filter((hobby) => hobby !== value),
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData((prevData) => ({
      ...prevData,
      file: file, // overwrite string with File object
    }));
  console.log('New file selected:', file);
  }
};

  const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = validateForm(formData);
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    setIsSignupSuccessful(true);

    const formToSend = { ...formData }; // keep the file object itself, not just name


    const formPayload = new FormData();
    formPayload.append('data', JSON.stringify(formToSend));
    if (formData.file && !formData.file.name?.startsWith('http')) {
      formPayload.append('file', formData.file);
    }

    fetch(isEditMode ? 'http://localhost:5000/update' : 'http://localhost:5000/submit', {
      method: isEditMode ? 'PUT' : 'POST',
      body: formPayload,
    })

      .then((res) => res.json())
      .then((data) => {
      alert(isEditMode ? "Updated Successfully" : "Registered Successfully!");
      navigate(isEditMode ? '/FetchData' : '/', { replace: true });
      })
      .catch((error) => {
        console.error('Error:', error);
        alert("Something went wrong while saving!");
      });
  }
};


  const validateForm = (data) => {
    const errors = {};
    if (!data.username.trim()) {
      errors.username = 'Username is required';
    }

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

    if (data.confirmPassword !== data.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!data.gender) {
      errors.gender = 'Gender is required';
    }

    if (!data.circle) {
      errors.circle = 'Circle is required';
    }

    if (data.hobbies.length === 0) {
      errors.hobbies = 'You must select at least one hobby';
    }

    if (!data.file && !isEditMode) {
      errors.file = 'File is required';
    } else if (data.file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(data.file.type)) {
        errors.file = 'Only PDF, DOC, and DOCX files are allowed';
      }

      const maxSizeInBytes = 50 * 1024 * 1024;
      if (data.file.size > maxSizeInBytes) {
        errors.file = 'File size exceeds 50MB limit';
      }
    }

    return errors;
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Sign Up</h2>
      <div className='underline'></div>

      {isSignupSuccessful && (
        <Message
          type="success"
          description={isEditMode ? "Updated Successfully!" : "Registered Successfully!"}
          closable
          style={{ marginBottom: '20px', background: '#e6ffed', color: '#1e4620' }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label">Username:</label>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              className="form-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder='Enter Username'
            />
          </div>
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div>
          <label className="form-label">Email:</label>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter Email'
              readOnly={isEditMode}
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div>
          <label className="form-label">Password:</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter Password'
            />
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div>
          <label className="form-label">Confirm Password:</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Confirm Password'
            />
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div>
          <label className="form-label">Gender:</label>
          <div className="gender-checkbox-group">
            {['male', 'female', 'other'].map((gender) => (
              <label key={gender}>
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={() => handleRadioChange(gender)}
                />
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </label>
            ))}
          </div>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>

        <div>
          <label className="form-label">Circle:</label>
          <div className="input-group">
            <AiFillAlert className="input-icon" />
            <select
              className="form-inputs"
              name="circle"
              value={formData.circle}
              onChange={handleChange}
            >
              <option value="">Select Circle</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="delhi">Delhi</option>
              <option value="kolkata">Kolkata</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="bangalore">Bangalore</option>
            </select>
          </div>
          {errors.circle && <span className="error-message">{errors.circle}</span>}
        </div>

        <div>
          <label className="form-label">Select Hobbies:</label>
          <div className="checkboxContainer">
            {['Reading', 'Travelling', 'Gaming', 'Music', 'Sports'].map((hobby) => (
              <div key={hobby} className="checkboxLabel">
                <input
                  type="checkbox"
                  name="hobbies"
                  value={hobby}
                  checked={formData.hobbies.includes(hobby)}
                  onChange={handleChange}
                />
                <label>{hobby}</label>
              </div>
            ))}
          </div>
          {errors.hobbies && <span className="error-message">{errors.hobbies}</span>}
        </div>

        <div>
  <label className="form-label">Upload File:</label>
  <div className="custom-file-wrapper">
    <label className="custom-file-button">
      Choose File
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden-file-input"
      />
    </label>

    {formData.file ? (
          typeof formData.file === 'string' ? (
            <a
              href={`http://localhost:5000/uploads/${encodeURIComponent(formData.file)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="file-name clickable"
            >
              {formData.file.split('/').pop()}
            </a>
          ) : (
            <span className="file-name">{formData.file.name}</span>
          )
        ) : (
          <span className="file-name">No file chosen</span>
        )}
          </div>
          {errors.file && <span className='error-message'>{errors.file}</span>}
        </div>


        <div className='submit-container'>
          <button className='submit' type='submit'>{isEditMode ? 'Update' : 'Sign Up'}</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;