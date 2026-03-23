import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from './ContactPage';
import { vi } from 'vitest';

vi.mock('./Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));
vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

describe('ContactPage', () => {
  it('renders the header and footer', () => {
    render(<ContactPage />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the contact form heading', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /fale conosco/i })).toBeInTheDocument();
  });

  it('renders name, email and request fields', () => {
    render(<ContactPage />);
    expect(screen.getByPlaceholderText(/seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sua solicitação/i)).toBeInTheDocument();
  });

  it('renders the Enviar button', () => {
    render(<ContactPage />);
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('shows the thank you popup after submit', () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByPlaceholderText(/seu nome/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/seu e-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/sua solicitação/i), { target: { value: 'Test request' } });
    fireEvent.submit(screen.getByRole('button', { name: /enviar/i }).closest('form')!);
    expect(screen.getByText(/obrigado por sua mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
  });

  it('clears form inputs and closes popup when Continuar is clicked', () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByPlaceholderText(/seu nome/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/seu e-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/sua solicitação/i), { target: { value: 'Test request' } });
    fireEvent.submit(screen.getByRole('button', { name: /enviar/i }).closest('form')!);
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.queryByText(/obrigado por sua mensagem/i)).not.toBeInTheDocument();
    expect((screen.getByPlaceholderText(/seu nome/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByPlaceholderText(/seu e-mail/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByPlaceholderText(/sua solicitação/i) as HTMLTextAreaElement).value).toBe('');
  });
});
