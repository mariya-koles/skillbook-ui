import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../models/Course';
import '../Courses/Courses.css';
import './CourseDetails.css';

const CourseDetails = () => {
    const { courseId } = useParams();
    const { user, login } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrolling, setEnrolling] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourse();
        // eslint-disable-next-line
    }, [courseId]);

    const fetchCourse = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8080/courses/${courseId}`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch course');
            const data = await response.json();
            setCourse(Course.fromJSON(data));
        } catch (err) {
            setError('Failed to load course. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const isUserEnrolled = () => {
        if (!user || !user.enrolledCourses) return false;
        return user.enrolledCourses.some(enrolled => enrolled.id === course?.id);
    };

    const handleEnroll = async () => {
        if (!course) return;
        setEnrolling(true);
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
                // Fetch updated user profile
                const profileRes = await fetch('http://localhost:8080/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const updatedUser = await profileRes.json();
                login(updatedUser);
            } else {
                setError('Failed to enroll in course.');
            }
        } catch (err) {
            setError('Error enrolling in course.');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return <div className="page-container"><div className="content-card"><div className="loading">Loading course...</div></div></div>;
    }
    if (error) {
        return <div className="page-container"><div className="content-card"><div className="error-message">{error}</div></div></div>;
    }
    if (!course) return null;

    return (
        <div className="page-container">
            <div className="course-details-card wide">
                <h2>{course.title}</h2>
                <div className="course-meta" style={{ marginBottom: '1.5rem' }}>
                    <span className="category">Category: {course.category}</span>
                    <span className="duration">Duration: {course.getFormattedDuration()}</span>
                    <span className="start-time">Starts: {course.getFormattedStartTime()}</span>
                </div>
                <p className="course-description" style={{ marginBottom: '1.5rem' }}>{course.description}</p>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4>Instructor Information</h4>
                    {course.instructor ? (
                        <div>
                            <div><strong>Name:</strong> {course.instructor.firstName} {course.instructor.lastName}</div>
                            <div><strong>Email:</strong> {course.instructor.email ? course.instructor.email : 'N/A'}</div>
                        </div>
                    ) : (
                        <div>No instructor information available.</div>
                    )}
                </div>
                <div className="long-description-section">
                    <h3>Description</h3>
                    <div className="long-description-content">
                        {course.longDescription ? course.longDescription : 'No additional description provided.'}
                    </div>
                </div>
                {user && user.role === 'LEARNER' && (
                    <button
                        className="enroll-button"
                        disabled={isUserEnrolled() || enrolling}
                        onClick={handleEnroll}
                    >
                        {isUserEnrolled() ? 'Enrolled' : enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                )}
                <button className="back-button" onClick={() => navigate('/courses')}>Back to Courses</button>
            </div>
        </div>
    );
};

export default CourseDetails; 