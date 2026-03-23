import { render, screen, fireEvent } from '@testing-library/react';
import ReviewModal from './ReviewModal';
import { vi } from 'vitest';

const mockProduct = {
  id: '1',
  name: 'Apple',
  price: 1.99,
  quantity: 1,
  image: 'apple.jpg',
  reviews: [
    { author: 'John', comment: 'Great!', date: '2023-01-01T00:00:00Z' }
  ],
  inStock: true
};

describe('ReviewModal', () => {
  it('does not render if product is null', () => {
    const { container } = render(
      <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders reviews and product name', () => {
    render(
      <ReviewModal product={mockProduct} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(screen.getByText(/reviews for apple/i)).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText(/great!/i)).toBeInTheDocument();
  });

  it('shows no reviews message if no reviews', () => {
    render(
      <ReviewModal product={{ ...mockProduct, reviews: [] }} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <ReviewModal product={mockProduct} onClose={onClose} onSubmit={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onSubmit with review data', () => {
    const onSubmit = vi.fn();
    render(
      <ReviewModal product={mockProduct} onClose={vi.fn()} onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByPlaceholderText(/your name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText(/your review/i), { target: { value: 'Nice apple!' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ author: 'Alice', comment: 'Nice apple!' })
    );
  });
});
