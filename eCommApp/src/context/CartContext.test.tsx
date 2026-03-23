import { render, screen } from '@testing-library/react';
import { CartProvider, CartContext } from './CartContext';
import { useContext } from 'react';
import { describe, it, expect } from 'vitest';

const TestComponent = ({ product }: any) => {
  const cart = useContext(CartContext);
  if (!cart) return <div>No context</div>;
  return (
    <>
      <button onClick={() => cart.addToCart(product)}>Add</button>
      <button onClick={cart.clearCart}>Clear</button>
      <div data-testid="cart-items">{cart.cartItems.length}</div>
    </>
  );
};

describe('CartContext', () => {
  it('provides default empty cart', () => {
    render(
      <CartProvider>
        <CartContext.Consumer>
          {value => <div>{value?.cartItems.length}</div>}
        </CartContext.Consumer>
      </CartProvider>
    );
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('adds a new product to cart', () => {
    const product = { id: '1', name: 'Apple', price: 1, inStock: true, reviews: [] };
    render(
      <CartProvider>
        <TestComponent product={product} />
      </CartProvider>
    );
    screen.getByText('Add').click();
    expect(screen.getByTestId('cart-items').textContent).toBe('1');
  });

  it('increments quantity if product already in cart', () => {
    const product = { id: '1', name: 'Apple', price: 1, inStock: true, reviews: [] };
    render(
      <CartProvider>
        <TestComponent product={product} />
      </CartProvider>
    );
    screen.getByText('Add').click();
    screen.getByText('Add').click();
    expect(screen.getByTestId('cart-items').textContent).toBe('1');
  });

  it('clears the cart', () => {
    const product = { id: '1', name: 'Apple', price: 1, inStock: true, reviews: [] };
    render(
      <CartProvider>
        <TestComponent product={product} />
      </CartProvider>
    );
    screen.getByText('Add').click();
    screen.getByText('Clear').click();
    expect(screen.getByTestId('cart-items').textContent).toBe('0');
  });
});
