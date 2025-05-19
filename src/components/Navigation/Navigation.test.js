import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Navigation from './Navigation';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

const renderNavigation = (userState = null, logoutFn = jest.fn()) => {
  jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockImplementation(() => ({
    user: userState,
    login: jest.fn(),
    logout: logoutFn,
  }));

  return render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
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

  test('shows dashboard and logout links when user is authenticated', () => {
    renderNavigation({ username: 'testuser' });
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const logoutLink = screen.getByRole('link', { name: /logout/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(logoutLink).toBeInTheDocument();
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

  test('handles logout successfully', () => {
    // Set a token in localStorage
    localStorage.setItem('token', 'test-token');
    
    const mockLogout = jest.fn();
    renderNavigation({ username: 'testuser' }, mockLogout);
    
    const logoutLink = screen.getByRole('link', { name: /logout/i });
    fireEvent.click(logoutLink, { preventDefault: () => {} });

    // Check that token was removed from localStorage
    expect(localStorage.getItem('token')).toBeNull();
    // Check that logout was called
    expect(mockLogout).toHaveBeenCalled();
    // Check that navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
}); 