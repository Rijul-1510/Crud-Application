import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import FetchData from './FetchData';
import ForgotPassword from './ForgotPassword';

const App = () => {
    const [signUps, setSignUps] = useState([]);
    const [editUserData, setEditUserData] = useState(null);
    const navigate = useNavigate();

    const showLoginPage = () => {
        navigate('/');
    };

    const showSignUpPage = (initialFormData = null) => {
        setEditUserData(initialFormData);
        navigate('/signup');
    };

    const addSignUp = (formData) => {
        setSignUps([...signUps, formData]);
        showLoginPage(); // After sign up, switch back to login page
    };

    const handleLoginSuccess = () => {
        navigate('/Fetchdata');
    };

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Login
                            onSignUpClick={() => showSignUpPage()}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <SignUp
                            initialFormData={editUserData}
                            onBackToLoginClick={showLoginPage}
                            addSignUp={addSignUp}
                        />
                    }
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/Fetchdata" element={<FetchData />} />
            </Routes>
        </div>
    );
};

export default App;
