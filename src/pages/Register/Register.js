import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../models/User';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: Role.LEARNER
    });
    const [error, setError] = useState('');
    const mounted = useRef(true);

    useEffect(() => {
        // Set mounted to true when component mounts
        mounted.current = true;
        // Cleanup function to run when component unmounts
        return () => {
            mounted.current = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (mounted.current) {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mounted.current) return;
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const requestData = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role.toString()
            };
            
            console.log('Sending registration data:', requestData);
            
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            let errorMessage = '';
            try {
                const responseText = await response.text();
                console.log('Raw server response:', responseText);

                if (response.ok) {
                    if (mounted.current) {
                        alert('Registration successful! Please log in.');
                        navigate('/login');
                    }
                    return;
                }

                // Handle error messages
                if (responseText.includes('Username already exists')) {
                    errorMessage = 'This username is already taken. Please choose a different username.';
                    if (mounted.current) {
                        setFormData(prev => ({
                            ...prev,
                            username: ''
                        }));
                    }
                } else {
                    errorMessage = responseText || 'Registration failed. Please try again.';
                }
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                errorMessage = 'Registration failed. Please try again.';
            }

            if (mounted.current) {
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (mounted.current) {
                setError('Registration failed. Please check your connection and try again.');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="content-card narrow">
                <h2>Create Your Account</h2>
                <form onSubmit={handleSubmit} className="register-form">
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

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
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
                            <option value={Role.LEARNER}>Learner</option>
                            <option value={Role.INSTRUCTOR}>Instructor</option>
                        </select>
                    </div>

                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register; 