import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ContactPage from './ContactPage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

describe('ContactPage', () => {
    it('renders the contact form', () => {
        render(<ContactPage />);

        expect(screen.getByText('Fale Conosco')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Solicitação')).toBeInTheDocument();
        expect(screen.getByText('Enviar')).toBeInTheDocument();
    });

    it('shows the thank-you modal when form is submitted', () => {
        render(<ContactPage />);

        fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'João' } });
        fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'joao@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Solicitação'), { target: { value: 'Minha solicitação' } });
        fireEvent.click(screen.getByText('Enviar'));

        expect(screen.getByText('Obrigado por sua mensagem')).toBeInTheDocument();
        expect(screen.getByText('Continuar')).toBeInTheDocument();
    });

    it('clears the form and closes the modal when Continuar is clicked', () => {
        render(<ContactPage />);

        fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'João' } });
        fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'joao@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Solicitação'), { target: { value: 'Minha solicitação' } });
        fireEvent.click(screen.getByText('Enviar'));

        fireEvent.click(screen.getByText('Continuar'));

        expect(screen.queryByText('Obrigado por sua mensagem')).not.toBeInTheDocument();
        expect((screen.getByPlaceholderText('Nome') as HTMLInputElement).value).toBe('');
        expect((screen.getByPlaceholderText('E-mail') as HTMLInputElement).value).toBe('');
        expect((screen.getByPlaceholderText('Solicitação') as HTMLTextAreaElement).value).toBe('');
    });
});
