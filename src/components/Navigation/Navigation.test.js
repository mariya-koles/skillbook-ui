import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Navigation from './Navigation';

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

const renderNavigation = (userState = null) => {
  // Override the mock for this render
  jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockImplementation(() => ({
    user: userState,
    login: jest.fn(),
    logout: jest.fn(),
  }));

  return render(
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Navigation Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks();
  });

  test('renders logo', () => {
    renderNavigation();
    const logo = screen.getByText('Skillbook', { selector: '.logo' });
    expect(logo).toBeInTheDocument();
  });

  test('shows login and register links when user is not authenticated', () => {
    renderNavigation(null);
    const loginLink = screen.getByRole('link', { name: /login/i });
    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });

  test('shows dashboard link when user is authenticated', () => {
    renderNavigation({ username: 'testuser' });
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /register/i })).not.toBeInTheDocument();
  });

  test('shows courses link regardless of authentication status', () => {
    const { unmount } = renderNavigation();
    expect(screen.getByRole('link', { name: /courses/i })).toBeInTheDocument();
    
    // Clean up previous render
    unmount();
    
    renderNavigation({ username: 'testuser' });
    expect(screen.getByRole('link', { name: /courses/i })).toBeInTheDocument();
  });
}); 