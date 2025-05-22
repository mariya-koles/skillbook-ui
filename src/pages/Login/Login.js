import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/shared.css';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (response.ok) {
                // Store JWT token if present
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    // Fetch user profile
                    const profileRes = await fetch('http://localhost:8080/users/me', {
                        headers: { 'Authorization': `Bearer ${data.token}` }
                    });
                    const userProfile = await profileRes.json();
                    login(userProfile); // Store full user in context
                    navigate('/dashboard');
                } else {
                    setError('Login failed: No token received.');
                }
            } else {
                // Handle both JSON and text error messages
                const errorMessage = typeof data === 'object' ? data.message : data;
                setError(errorMessage || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error occurred. Please try again.');
        }
    };

    return (
        <div className="page-container">
            <div className="login-card">
                <h2>Welcome Back!</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group password-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>


                    <button type="submit" className="primary-button">
                        Log In
                    </button>

                    <p className="text-center mt-1">
                        Don't have an account?{' '}
                        <span 
                            className="link-text"
                            onClick={() => navigate('/register')}
                        >
                            Register here
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
