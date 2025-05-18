import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/shared.css';
import './Register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'LEARNER'
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);        
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const requestData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.text();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error occurred. Please try again.');
        }
    };

    return (
        <div className="page-container">
            <div className="content-card">
                <h2>Create Your Account</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

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

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
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

                    <div className="form-group password-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                            >
                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>


                    <div className="form-group">
                        <label htmlFor="role">I want to register as:</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="LEARNER">Learner</option>
                            <option value="INSTRUCTOR">Instructor</option>
                        </select>
                    </div>

                    <button type="submit" className="primary-button">
                        Register
                    </button>

                    <p className="text-center mt-1">
                        Already have an account?{' '}
                        <span 
                            className="link-text"
                            onClick={() => navigate('/login')}
                        >
                            Login here
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register; 