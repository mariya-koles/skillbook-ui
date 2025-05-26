import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Courses from './Courses';

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

// Mock fetch
global.fetch = jest.fn();

const mockCourses = [
  {
    id: 1,
    title: 'React Basics',
    description: 'Learn React fundamentals',
    category: 'Programming',
    duration: 120,
    startTime: '2024-01-15T10:00:00Z',
    instructor: { firstName: 'Jane', lastName: 'Smith' }
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Master JavaScript concepts',
    category: 'Programming',
    duration: 180,
    startTime: '2024-02-01T14:00:00Z',
    instructor: { firstName: 'Bob', lastName: 'Johnson' }
  }
];

const mockLearner = {
  id: 1,
  role: 'LEARNER',
  enrolledCourses: []
};

const mockInstructor = {
  id: 2,
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
      <Courses />
    </BrowserRouter>
  );
};

describe('Courses', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    fetch.mockClear();
    mockUseAuth.mockClear();
  });

  test('renders courses list for learner', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
    });
  });

  test('shows "Create a Course" button for instructor', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });
    
    renderWithAuth(mockInstructor);
    
    await waitFor(() => {
      expect(screen.getByText('Create a Course')).toBeInTheDocument();
    });
  });

  test('does not show "Create a Course" button for learner', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.queryByText('Create a Course')).not.toBeInTheDocument();
    });
  });

  test('shows "Enroll Now" button for learner', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      const enrollButtons = screen.getAllByText('Enroll Now');
      expect(enrollButtons).toHaveLength(2); // One for each course
    });
  });

  test('does not show "Enroll Now" button for instructor', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });
    
    renderWithAuth(mockInstructor);
    
    await waitFor(() => {
      expect(screen.queryByText('Enroll Now')).not.toBeInTheDocument();
    });
  });

  test('navigates to course details when course title is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      const courseTitle = screen.getByText('React Basics');
      fireEvent.click(courseTitle);
      expect(mockNavigate).toHaveBeenCalledWith('/courses/1');
    });
  });

  test('navigates to create course when "Create a Course" is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });
    
    renderWithAuth(mockInstructor);
    
    await waitFor(() => {
      const createButton = screen.getByText('Create a Course');
      fireEvent.click(createButton);
      expect(mockNavigate).toHaveBeenCalledWith('/courses/create');
    });
  });

  test('handles enrollment successfully', async () => {
    const mockUpdatedUser = {
      ...mockLearner,
      enrolledCourses: [{ id: 1, title: 'React Basics' }]
    };

    // Mock courses fetch first, then enrollment API call
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdatedUser
    });

    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      const enrollButton = screen.getAllByText('Enroll Now')[0];
      fireEvent.click(enrollButton);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/courses/1/enroll', expect.objectContaining({
        method: 'POST'
      }));
    });
  });

  test('displays error message when courses fail to load', async () => {
    // Clear the successful mock from beforeEach
    fetch.mockClear();
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load courses. Please try again later.')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    renderWithAuth(mockLearner);
    
    expect(screen.getByText('Loading courses...')).toBeInTheDocument();
  });
}); 