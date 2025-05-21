import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../models/Course';
import './Courses.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:8080/courses', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const data = await response.json();
            console.log('Fetched courses:', data);
            // Convert JSON data to Course objects
            const courseObjects = data.map(courseData => Course.fromJSON(courseData));
            setCourses(courseObjects);
        } catch (err) {
            setError('Failed to load courses. Please try again later.');
            console.error('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    // Helper to check if user is enrolled in a course
    const isUserEnrolled = (courseId) => {
        if (!user || !user.enrolledCourses) return false;
        return user.enrolledCourses.some(enrolled => enrolled.id === courseId);
    };

    // Enroll handler
    const handleEnroll = async (e, course) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/courses/${course.id}/enroll`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                // Optimistically update user context
                const updatedUser = {
                    ...user,
                    enrolledCourses: [...(user.enrolledCourses || []), { id: course.id }]
                };
                login(updatedUser); // update context
                // Optionally show a success message
            } else {
                // Optionally show an error message
                console.error('Failed to enroll in course');
            }
        } catch (err) {
            console.error('Error enrolling in course:', err);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="content-card">
                    <div className="loading">Loading courses...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="content-card">
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="content-card">
                <h2>Available Courses</h2>
                <div className="courses-grid">
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <div 
                                key={course.id} 
                                className="course-card"
                                onClick={() => handleCourseClick(course.id)}
                            >
                                <div className="course-image">
                                    <div className="course-image-placeholder">
                                        {course.title.charAt(0)}
                                    </div>
                                </div>
                                <div className="course-content">
                                    <h3>{course.title}</h3>
                                    <p className="course-description">{course.description}</p>
                                    <div className="course-meta">
                                        <span className="category">Category: {course.category}</span>
                                        <span className="duration">Duration: {course.getFormattedDuration()}</span>
                                        <span className="start-time">Starts: {course.getFormattedStartTime()}</span>
                                    </div>
                                    {user && (
                                        <button 
                                            className="enroll-button"
                                            disabled={isUserEnrolled(course.id)}
                                            onClick={(e) => handleEnroll(e, course)}
                                        >
                                            {isUserEnrolled(course.id) ? 'Enrolled' : 'Enroll Now'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-courses">No courses available at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses; 