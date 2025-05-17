import React from "react";
import "./Dashboard.css"; 
import "../../App.css";
function Dashboard() {
  return (
    <div className="faded-background">
        <div className="dashboard-card">
            <div className="dashboard-container">
            <h2 className="dashboard-heading">Welcome <span className="username">username</span>!</h2>

            <div className="dashboard-content">
                {/* Left Panel */}
                <div className="profile-box">
                <div className="profile-photo"> (profile photo will go here) </div>
                <p><strong>Name:</strong></p>
                <p><strong>Email:</strong></p>
                <p><strong>Courses Enrolled:</strong> (number of courses enrolled in will go here)</p>
                </div>

                {/* Right Panel */}
                <div className="courses-box">
                <h3>Your Courses</h3>

                {/* Course Cards (these will be dynamic later) */}
                <div className="course-card">
                    <div>
                    <h4>COURSE NAME</h4>
                    <p>Course Description paragraph</p>
                    </div>
                    <p className="instructor-name">Instructor Name</p>
                </div>

                <div className="course-card">
                    <div>
                    <h4>COURSE NAME</h4>
                    <p>Course Description paragraph</p>
                    </div>
                    <p className="instructor-name">Instructor Name</p>
                </div>

                <div className="course-card">
                    <div>
                    <h4>COURSE NAME</h4>
                    <p>Course Description paragraph</p>
                    </div>
                    <p className="instructor-name">Instructor Name</p>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;
