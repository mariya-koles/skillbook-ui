import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component that uses the auth context
const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-status">{user ? 'logged-in' : 'logged-out'}</div>
      <button onClick={() => login({ username: 'testuser' })} data-testid="login-button">
        Login
      </button>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  test('provides authentication context to children', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially should be logged out
    expect(getByTestId('user-status')).toHaveTextContent('logged-out');
  });

  test('login updates the user context', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click login button
    act(() => {
      getByTestId('login-button').click();
    });

    // Should now be logged in
    expect(getByTestId('user-status')).toHaveTextContent('logged-in');
  });

  test('logout clears the user context', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    act(() => {
      getByTestId('login-button').click();
    });
    expect(getByTestId('user-status')).toHaveTextContent('logged-in');

    // Then logout
    act(() => {
      getByTestId('logout-button').click();
    });
    expect(getByTestId('user-status')).toHaveTextContent('logged-out');
  });
}); 