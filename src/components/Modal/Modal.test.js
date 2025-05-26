import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders modal when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  test('calls onClose when OK button is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when overlay is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const overlay = screen.getByText('Test Modal').closest('.modal-overlay');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when modal content is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const modalContent = screen.getByText('Modal content');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('renders without title when title is not provided', () => {
    const propsWithoutTitle = { ...defaultProps, title: undefined };
    render(<Modal {...propsWithoutTitle} />);
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  test('renders with custom title', () => {
    const customTitle = 'Custom Modal Title';
    render(<Modal {...defaultProps} title={customTitle} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  test('renders children content correctly', () => {
    const customContent = (
      <div>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
        <button>Custom Button</button>
      </div>
    );
    
    render(<Modal {...defaultProps}>{customContent}</Modal>);
    
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument();
  });

  test('renders with custom button text', () => {
    render(<Modal {...defaultProps} buttonText="Close" />);
    
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
  });

  test('does not render button when buttonText is falsy', () => {
    render(<Modal {...defaultProps} buttonText="" />);
    
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal').closest('.modal-overlay')).toBeInTheDocument();
    expect(screen.getByText('Modal content').closest('.modal-content')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toHaveClass('modal-title');
  });
}); 