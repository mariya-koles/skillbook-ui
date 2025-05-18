import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders navigation elements', () => {
    render(<App />);
    
    // Test logo in navigation
    const navLogo = screen.getByText('Skillbook', { selector: '.logo' });
    expect(navLogo).toBeInTheDocument();
    
    // Test navigation links
    const homeLink = screen.getByRole('link', { name: /home/i });
    const loginLink = screen.getByRole('link', { name: /login/i });
    const registerLink = screen.getByRole('link', { name: /register/i });
    const coursesLink = screen.getByRole('link', { name: /courses/i });
    
    expect(homeLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
    expect(coursesLink).toBeInTheDocument();
  });

  test('renders home page content', () => {
    render(<App />);
    
    // Test welcome message
    const welcomeText = screen.getByText(/welcome to/i);
    expect(welcomeText).toBeInTheDocument();
    
    // Test brand name in hero section
    const brandName = screen.getByText('Skillbook', { selector: '.home-brand' });
    expect(brandName).toBeInTheDocument();
    
    // Test call-to-action button
    const ctaButton = screen.getByRole('button', { name: /get started/i });
    expect(ctaButton).toBeInTheDocument();
  });
});
