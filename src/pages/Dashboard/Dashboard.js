import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();

    // Log enrolledCourses for debugging
    console.log('User enrolledCourses:', user?.enrolledCourses);

    return (
        <div className="page-container">
            <div className="content-card">
                <h2>Welcome {user?.username}!</h2>
                
                <div className="dashboard-grid">
                    <div className="profile-section">
                        <div className="profile-photo">
                            (profile photo will go here)
                        </div>
                        <div className="profile-info">
                            <p><strong>Name:</strong> {user?.username}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Courses Enrolled:</strong> {user?.enrolledCourses?.length || 0}</p>
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
        </div>
    );
};

export default Dashboard;
