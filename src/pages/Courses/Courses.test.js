import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Courses from './Courses';

// Mock fetch
global.fetch = jest.fn();

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockCourses = [
    {
        id: 1,
        title: 'Introduction to React',
        description: 'Learn the basics of React development',
        instructor: 1,
        duration: 90
    },
    {
        id: 2,
        title: 'Advanced JavaScript',
        description: 'Deep dive into modern JavaScript concepts',
        instructor: 2,
        duration: 180
    }
];

const renderCourses = (userState = null) => {
    jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockImplementation(() => ({
        user: userState,
        login: jest.fn(),
        logout: jest.fn(),
    }));

    return render(
        <BrowserRouter>
            <AuthProvider>
                <Courses />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('Courses Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows loading state initially', () => {
        renderCourses();
        expect(screen.getByText('Loading courses...')).toBeInTheDocument();
    });

    test('displays courses when data is loaded successfully', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockCourses
        });

        renderCourses();
        
        await waitFor(() => {
            expect(screen.getByText('Introduction to React')).toBeInTheDocument();
            expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
        });
    });

    test('shows error message when fetch fails', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

        renderCourses();
        
        await waitFor(() => {
            expect(screen.getByText('Failed to load courses. Please try again later.')).toBeInTheDocument();
        });
    });

    test('shows enroll button for authenticated users', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockCourses
        });

        renderCourses({ username: 'testuser' });
        
        await waitFor(() => {
            const enrollButtons = screen.getAllByText('Enroll Now');
            expect(enrollButtons).toHaveLength(2);
        });
    });

    test('does not show enroll button for unauthenticated users', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockCourses
        });

        renderCourses();
        
        await waitFor(() => {
            expect(screen.queryByText('Enroll Now')).not.toBeInTheDocument();
        });
    });

    test('shows no courses message when courses array is empty', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        renderCourses();
        
        await waitFor(() => {
            expect(screen.getByText('No courses available at the moment.')).toBeInTheDocument();
        });
    });
}); 