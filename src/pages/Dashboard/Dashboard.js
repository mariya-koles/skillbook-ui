import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();

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
                            <p><strong>Courses Enrolled:</strong> {user?.coursesEnrolled?.length || 0}</p>
                        </div>
                    </div>

                    <div className="courses-section">
                        <h3>Your Courses</h3>
                        <div className="courses-list">
                            {user?.coursesEnrolled?.length > 0 ? (
                                user.coursesEnrolled.map(course => (
                                    <div key={course.id} className="course-card">
                                        <h4>{course.name}</h4>
                                        <p>{course.description}</p>
                                        <p className="instructor">Instructor: {course.instructorName}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No courses enrolled yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
