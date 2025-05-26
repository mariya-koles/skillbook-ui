import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import CourseDetails from './CourseDetails';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ courseId: '1' }),
}));

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock fetch
global.fetch = jest.fn();

const mockCourse = {
  id: 1,
  title: 'React Basics',
  description: 'Learn React fundamentals',
  longDescription: 'This is a comprehensive course covering all aspects of React development including components, state management, hooks, and best practices.',
  category: 'Programming',
  duration: 120,
  startTime: '2024-01-15T10:00:00Z',
  instructor: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com'
  }
};

const mockLearner = {
  id: 1,
  role: 'LEARNER',
  enrolledCourses: []
};

const mockEnrolledLearner = {
  id: 1,
  role: 'LEARNER',
  enrolledCourses: [{ id: 1, title: 'React Basics' }]
};

const mockInstructor = {
  id: 2,
  role: 'INSTRUCTOR',
  enrolledCourses: []
};

const renderWithAuth = (user, courseId = '1') => {
  mockUseAuth.mockReturnValue({
    user,
    login: jest.fn(),
    logout: jest.fn()
  });

  return render(
    <MemoryRouter initialEntries={[`/courses/${courseId}`]}>
      <CourseDetails />
    </MemoryRouter>
  );
};

describe('CourseDetails', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    fetch.mockClear();
    mockUseAuth.mockClear();
  });

  test('renders course details correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.getByText('Category: Programming')).toBeInTheDocument();
      expect(screen.getByText('Learn React fundamentals')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  test('displays instructor information', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  test('displays long description when available', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText(/This is a comprehensive course/)).toBeInTheDocument();
    });
  });

  test('displays fallback when long description is missing', async () => {
    const courseWithoutLongDesc = { ...mockCourse, longDescription: null };
    // Clear previous mocks and set up new one
    fetch.mockClear();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => courseWithoutLongDesc
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText('No additional description provided.')).toBeInTheDocument();
    });
  });

  test('shows "Enroll Now" button for non-enrolled learner', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText('Enroll Now')).toBeInTheDocument();
    });
  });

  test('shows "Enrolled" button for enrolled learner', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    
    renderWithAuth(mockEnrolledLearner);
    
    await waitFor(() => {
      expect(screen.getByText('Enrolled')).toBeInTheDocument();
      expect(screen.getByText('Enrolled')).toBeDisabled();
    });
  });

  test('does not show enroll button for instructor', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    
    renderWithAuth(mockInstructor);
    
    await waitFor(() => {
      expect(screen.queryByText('Enroll Now')).not.toBeInTheDocument();
      expect(screen.queryByText('Enrolled')).not.toBeInTheDocument();
    });
  });

  test('handles enrollment successfully', async () => {
    const mockUpdatedUser = {
      ...mockLearner,
      enrolledCourses: [{ id: 1, title: 'React Basics' }]
    };

    // Mock course fetch first, then enrollment API call
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdatedUser
    });

    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      const enrollButton = screen.getByText('Enroll Now');
      fireEvent.click(enrollButton);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/courses/1/enroll', expect.objectContaining({
        method: 'POST'
      }));
    });
  });

  test('navigates back to courses when back button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      const backButton = screen.getByText('Back to Courses');
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/courses');
    });
  });

  test('displays error message when course fails to load', async () => {
    // Clear the successful mock from beforeEach
    fetch.mockClear();
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load course. Please try again later.')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    renderWithAuth(mockLearner);
    
    expect(screen.getByText('Loading course...')).toBeInTheDocument();
  });

  test('displays "N/A" for instructor email when missing', async () => {
    const courseWithoutEmail = {
      ...mockCourse,
      instructor: { firstName: 'Jane', lastName: 'Smith', email: null }
    };
    
    // Clear previous mocks and set up new one
    fetch.mockClear();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => courseWithoutEmail
    });
    
    renderWithAuth(mockLearner);
    
    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  test('handles enrollment error gracefully', async () => {
    // First mock successful course fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse
    });
    
    renderWithAuth(mockLearner);
    
    // Wait for course to load and button to appear
    await waitFor(() => {
      expect(screen.getByText('Enroll Now')).toBeInTheDocument();
    });
    
    // Now mock enrollment API failure
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400
    });

    const enrollButton = screen.getByText('Enroll Now');
    fireEvent.click(enrollButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to enroll in course.')).toBeInTheDocument();
    });
  });
}); 