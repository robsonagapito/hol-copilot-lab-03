import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const renderWithCartContext = (cartItems: CartItem[] = mockCartItems, clearCart = vi.fn()) => {
    return render(
        <CartContext.Provider value={{
            cartItems,
            addToCart: vi.fn(),
            clearCart,
        }}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('shows empty cart message when cart is empty', () => {
        renderWithCartContext([]);
        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it('shows checkout modal when checkout button is clicked', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
    });

    it('processes order and clears cart on confirm checkout', () => {
        const clearCart = vi.fn();
        renderWithCartContext(mockCartItems, clearCart);
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        fireEvent.click(screen.getByTestId('confirm-checkout'));
        expect(clearCart).toHaveBeenCalled();
        expect(screen.getByText(/your order has been processed/i)).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('returns to cart when cancel is clicked in checkout modal', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        fireEvent.click(screen.getByTestId('cancel-checkout'));
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    it('handles edge case: cart items with zero quantity', () => {
        const items = [{ ...mockCartItems[0], quantity: 0 }];
        renderWithCartContext(items);
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 0')).toBeInTheDocument();
    });

    it('handles edge case: cart items with missing image', () => {
        const items = [{ ...mockCartItems[0], image: undefined as any }];
        renderWithCartContext(items);
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByAltText('Test Product 1')).toBeInTheDocument();
    });

    it('handles edge case: cart items with negative price', () => {
        const items = [{ ...mockCartItems[0], price: -5 }];
        renderWithCartContext(items);
        expect(screen.getByText('Price: $-5.00')).toBeInTheDocument();
    });

    it('throws error if CartContext is missing', () => {
        // Suppress error output for this test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<CartPage />)).toThrow(/CartContext must be used within a CartProvider/);
        spy.mockRestore();
    });
});
