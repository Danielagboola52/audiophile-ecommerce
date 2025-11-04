'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';

export default function CartModal() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, clearCart, cartTotal } = useCart();
  const router = useRouter();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Modal */}
      <div className="fixed top-28 right-4 md:right-10 lg:right-20 z-50 bg-white rounded-lg p-8 w-[90%] max-w-[377px] shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-h6 uppercase">Cart ({cart.length})</h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-body text-black/50 hover:text-primary-orange underline transition-colors"
            >
              Remove all
            </button>
          )}
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <p className="text-body text-center text-black/50 py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-6 max-h-[300px] overflow-y-auto mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-secondary-grey rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-body font-bold">{item.shortName}</h3>
                    <p className="text-sm text-black/50 font-bold">
                      $ {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-secondary-grey">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 hover:text-primary-orange transition-colors text-black/25 font-bold"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-subtitle font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 hover:text-primary-orange transition-colors text-black/25 font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-body text-black/50 uppercase">Total</span>
              <span className="text-h6">$ {(cartTotal || 0).toLocaleString()}</span>
            </div>

            {/* Checkout Button */}
            <Button variant="primary" fullWidth onClick={handleCheckout}>
              Checkout
            </Button>
          </>
        )}
      </div>
    </>
  );
}