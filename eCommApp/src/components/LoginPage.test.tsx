import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage';
import { vi } from 'vitest';

vi.mock('./Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error on invalid credentials', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('navigates to admin on correct credentials', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });
});
