import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';
import { vi } from 'vitest';

vi.mock('./Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));
vi.mock('./ReviewModal', () => ({
	default: ({ product, onClose, onSubmit }: any) => product ? (
		<div data-testid="review-modal">
			<button onClick={onClose}>Close</button>
			<button onClick={() => onSubmit({ author: 'Test', comment: 'Test review', date: new Date().toISOString() })}>Submit Review</button>
		</div>
	) : null
}));

global.fetch = vi.fn((url) => {
	if (typeof url === 'string' && url.includes('apple.json')) {
		return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: '1', name: 'Apple', price: 1.99, inStock: true, reviews: [] }) });
	}
	if (typeof url === 'string') {
		return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: url, name: url, price: 2, inStock: true, reviews: [] }) });
	}
	return Promise.reject('Unknown URL');
}) as any;

describe('ProductsPage', () => {
	const addToCart = vi.fn();
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('shows loading state initially', () => {
		render(
			<CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
				<ProductsPage />
			</CartContext.Provider>
		);
		expect(screen.getByText(/loading products/i)).toBeInTheDocument();
	});

	it('renders products after loading', async () => {
		render(
			<CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
				<ProductsPage />
			</CartContext.Provider>
		);
		await waitFor(() => expect(screen.getByText('Apple')).toBeInTheDocument());
		expect(screen.getByText('$1.99')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
	});

	it('calls addToCart when add to cart is clicked', async () => {
		render(
			<CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
				<ProductsPage />
			</CartContext.Provider>
		);
		await waitFor(() => screen.getByRole('button', { name: /add to cart/i }));
		fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
		expect(addToCart).toHaveBeenCalled();
	});

	it('disables add to cart if out of stock', async () => {
		(fetch as any).mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ id: '1', name: 'Apple', price: 1.99, inStock: false, reviews: [] }) }));
		render(
			<CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
				<ProductsPage />
			</CartContext.Provider>
		);
		await waitFor(() => screen.getByRole('button', { name: /out of stock/i }));
		expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
	});

	it('opens and closes review modal', async () => {
		render(
			<CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
				<ProductsPage />
			</CartContext.Provider>
		);
		await waitFor(() => screen.getByText('Apple'));
		fireEvent.click(screen.getByAltText('Apple'));
		expect(screen.getByTestId('review-modal')).toBeInTheDocument();
		fireEvent.click(screen.getByText('Close'));
		expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
	});

	it('handles review submission', async () => {
		render(
			<CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
				<ProductsPage />
			</CartContext.Provider>
		);
		await waitFor(() => screen.getByText('Apple'));
		fireEvent.click(screen.getByAltText('Apple'));
		fireEvent.click(screen.getByText('Submit Review'));
		// No error means review submission logic ran
	});
});
