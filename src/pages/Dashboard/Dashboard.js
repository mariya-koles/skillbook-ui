import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import Modal from '../../components/Modal/Modal'; // Adjust path if needed

const Dashboard = () => {
    const { user, login } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        profilePicture: null,
    });
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState('Save');

    // Track changes to formData
    useEffect(() => {
        setIsDirty(
            formData.username !== (user?.username || '') ||
            formData.email !== (user?.email || '') ||
            formData.password !== '' ||
            formData.firstName !== (user?.firstName || '') ||
            formData.lastName !== (user?.lastName || '') ||
            formData.profilePicture !== null
        );
    }, [formData, user]);

    // Log enrolledCourses for debugging
    useEffect(() => {
        console.log('User enrolledCourses:', user?.enrolledCourses);
    }, [user?.enrolledCourses]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    // Helper to convert file to base64 string
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // get only the base64 part
            reader.onerror = error => reject(error);
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        let profilePhotoBase64 = undefined;
        if (formData.profilePicture) {
            profilePhotoBase64 = await fileToBase64(formData.profilePicture);
        }

        // Build the user object to send
        const updatedUser = {
            username: formData.username,
            email: formData.email,
            password: formData.password || undefined,
            firstName: formData.firstName,
            lastName: formData.lastName,
            profilePhoto: profilePhotoBase64,
            enrolledCourses: user?.enrolledCourses || [],
            role: user?.role
        };
        console.log("User to update:", updatedUser);

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/users/me', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            const user = await response.json();
            login(user); // Update user context
            setSaveStatus('Saved');
            setIsDirty(false);
            setTimeout(() => setSaveStatus('Save'), 2000);
            setShowModal(false);
            console.log('User updated:', user);
        } else {
            alert('Failed to update profile');
        }
    };

    return (
        <div className="page-container">
            <div className="content-card">
                <h2>Welcome {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username}!</h2>
                
                <div className="dashboard-grid">
                    <div className="profile-section">
                        <div className="profile-photo">
                            {user?.profilePhoto ? (
                                <img
                                    src={`data:image/png;base64,${user.profilePhoto}`}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        display: 'block'
                                    }}
                                />
                            ) : (
                                <span>(profile photo will go here)</span>
                            )}
                        </div>
                        <div className="profile-info">
                            <p>
                                <strong>Name:</strong>{" "}
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user?.username}
                            </p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Courses Enrolled:</strong> {user?.enrolledCourses?.length || 0}</p>
                            <button className="update-profile-btn" onClick={() => setShowModal(true)}>
                                Update
                            </button>
                        </div>
                    </div>

                    <div className="courses-section">
                        <h3>Your Courses</h3>
                        {user?.enrolledCourses?.length > 0 ? (
                            <table className="courses-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Instructor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.enrolledCourses.map(course => (
                                        <tr key={course.id}>
                                            <td>{course.title}</td>
                                            <td>{course.description}</td>
                                            <td>{course.instructor ? `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No courses enrolled yet.</p>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Update Profile"
                buttonText=""
            >
                <form onSubmit={handleProfileUpdate} className="update-profile-form">
                    <div className="form-row">
                        <label htmlFor="username">Username:</label>
                        <input id="username" name="username"  type="text" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    <div className="form-row">
                        <label htmlFor="email">Email:</label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-row">
                        <label htmlFor="password">Password:</label>
                        <input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="firstName">First Name:</label>
                        <input id="firstName" name="firstName"  type="text" value={formData.firstName} onChange={handleInputChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="lastName">Last Name:</label>
                        <input id="lastName" name="lastName"  type="text"value={formData.lastName} onChange={handleInputChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="profilePicture">Profile Picture:</label>
                        <input id="profilePicture" name="profilePicture" type="file" accept="image/*" onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="primary-button" disabled={!isDirty}>{saveStatus}</button>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
