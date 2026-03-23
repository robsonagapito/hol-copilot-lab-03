import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { vi } from 'vitest';

vi.mock('./Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));
vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

describe('HomePage', () => {
  it('renders the header and footer', () => {
    render(<HomePage />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the welcome message', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /welcome to the the daily harvest/i })).toBeInTheDocument();
  });

  it('renders the products page prompt', () => {
    render(<HomePage />);
    expect(screen.getByText(/check out our products page/i)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
