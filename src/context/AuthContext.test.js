import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component to access auth context
const TestComponent = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user-info">
        {user ? `${user.firstName || user.username} ${user.lastName || ''}`.trim() : 'no-user'}
      </div>
      <button onClick={() => login({ firstName: 'John', lastName: 'Doe', username: 'johndoe' })}>
        Login
      </button>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  test('provides initial unauthenticated state', () => {
    renderWithAuthProvider();
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('no-user');
  });

  test('handles login with user data', () => {
    renderWithAuthProvider();
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(screen.getByTestId('user-info')).toHaveTextContent('John Doe');
  });

  test('handles logout', () => {
    renderWithAuthProvider();
    
    // First login
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    expect(screen.getByTestId('user-info')).toHaveTextContent('John Doe');

    // Then logout
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(screen.getByTestId('user-info')).toHaveTextContent('no-user');
  });

  test('provides correct context values', () => {
    const TestContextValues = () => {
      const context = useAuth();
      
      return (
        <div>
          <div data-testid="has-user">{context.user ? 'yes' : 'no'}</div>
          <div data-testid="has-login">{typeof context.login === 'function' ? 'yes' : 'no'}</div>
          <div data-testid="has-logout">{typeof context.logout === 'function' ? 'yes' : 'no'}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestContextValues />
      </AuthProvider>
    );

    expect(screen.getByTestId('has-user')).toHaveTextContent('no');
    expect(screen.getByTestId('has-login')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-logout')).toHaveTextContent('yes');
  });

  test('throws error when useAuth is used outside AuthProvider', () => {
    const TestWithoutProvider = () => {
      useAuth();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => render(<TestWithoutProvider />)).toThrow();

    console.error = originalError;
  });
}); 