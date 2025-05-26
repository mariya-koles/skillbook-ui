import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  username: 'johndoe',
  role: 'LEARNER',
  enrolledCourses: [
    {
      id: 1,
      title: 'React Basics',
      description: 'Learn React fundamentals',
      instructor: { firstName: 'Jane', lastName: 'Smith' }
    }
  ]
};

const mockInstructor = {
  ...mockUser,
  role: 'INSTRUCTOR',
  enrolledCourses: []
};

const renderWithAuth = (user) => {
  mockUseAuth.mockReturnValue({
    user,
    login: jest.fn(),
    logout: jest.fn()
  });

  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseAuth.mockClear();
  });

  test('renders dashboard for learner with courses', () => {
    renderWithAuth(mockUser);
    
    expect(screen.getByText('Welcome John Doe!')).toBeInTheDocument();
    expect(screen.getByText('Courses Enrolled:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('React Basics')).toBeInTheDocument();
  });

  test('renders dashboard for instructor with no courses', () => {
    renderWithAuth(mockInstructor);
    
    expect(screen.getByText('Courses Managed:')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('No courses.')).toBeInTheDocument();
  });

  test('renders "No courses enrolled yet" for learner with no courses', () => {
    const learnerWithNoCourses = { ...mockUser, enrolledCourses: [] };
    renderWithAuth(learnerWithNoCourses);
    
    expect(screen.getByText('No courses enrolled yet.')).toBeInTheDocument();
  });

  test('navigates to course details when course row is clicked', () => {
    renderWithAuth(mockUser);
    
    const courseRow = screen.getByText('React Basics').closest('tr');
    fireEvent.click(courseRow);
    
    expect(mockNavigate).toHaveBeenCalledWith('/courses/1');
  });

  test('opens update profile modal when update button is clicked', () => {
    renderWithAuth(mockUser);
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    expect(screen.getByText('Update Profile')).toBeInTheDocument();
  });

  test('displays user name when firstName and lastName are available', () => {
    renderWithAuth(mockUser);
    
    expect(screen.getByText('Welcome John Doe!')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('displays username when firstName or lastName are missing', () => {
    const userWithoutName = { ...mockUser, firstName: null, lastName: null };
    renderWithAuth(userWithoutName);
    
    expect(screen.getByText('Welcome johndoe!')).toBeInTheDocument();
  });

  test('shows course count correctly', () => {
    renderWithAuth(mockUser);
    
    expect(screen.getByText('Courses Enrolled:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('shows instructor course count correctly', () => {
    renderWithAuth(mockInstructor);
    
    expect(screen.getByText('Courses Managed:')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
}); 