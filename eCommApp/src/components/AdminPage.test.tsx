import { render, screen, fireEvent } from '@testing-library/react';
import AdminPage from './AdminPage';
import { vi } from 'vitest';

vi.mock('./Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));
vi.mock('react-router-dom', () => ({ Link: ({ children }: any) => <div>{children}</div> }));

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders admin portal and default state', () => {
    render(<AdminPage />);
    expect(screen.getByText(/welcome to the admin portal/i)).toBeInTheDocument();
    expect(screen.getByText(/no sale active/i)).toBeInTheDocument();
  });

  it('shows error for invalid input', () => {
    render(<AdminPage />);
    fireEvent.change(screen.getByLabelText(/set sale percent/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
  });

  it('sets sale percent for valid input', () => {
    render(<AdminPage />);
    fireEvent.change(screen.getByLabelText(/set sale percent/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/all products are 10% off/i)).toBeInTheDocument();
  });

  it('ends sale and resets input', () => {
    render(<AdminPage />);
    fireEvent.change(screen.getByLabelText(/set sale percent/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /end sale/i }));
    expect(screen.getByText(/no sale active/i)).toBeInTheDocument();
  });

  it('renders back to storefront button', () => {
    render(<AdminPage />);
    expect(screen.getByRole('button', { name: /back to storefront/i })).toBeInTheDocument();
  });
});
