'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Unwrap params
  const { slug } = use(params);

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="container mx-auto px-6 lg:px-20 py-24 text-center">
        <h1 className="text-h3 mb-8">Product not found</h1>
        <p className="text-body mb-8">Looking for: {slug}</p>
        <Button variant="primary" href="/">
          Go Home
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        shortName: product.shortName,
        price: product.price,
        image: product.images.mobile,
      },
      quantity
    );
    alert(`Added ${quantity} ${product.shortName} to cart!`);
  };

  return (
    <div className="bg-secondary-light-grey min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-20">
        <button
          onClick={() => router.back()}
          className="text-body text-black/50 hover:text-primary-orange mb-8 inline-block"
        >
          Go Back
        </button>

        {/* Product Details */}
        <div className="bg-white rounded-lg p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="bg-secondary-grey rounded-lg h-96 flex items-center justify-center">
              <p className="text-h6">{product.name} Image</p>
            </div>

            {/* Product Info */}
            <div>
              {product.isNew && (
                <p className="text-overline text-primary-orange uppercase mb-4">
                  New Product
                </p>
              )}
              <h1 className="text-h2 uppercase mb-8">{product.name}</h1>
              <p className="text-body text-black/50 mb-8">{product.description}</p>
              <p className="text-h6 mb-8">$ {product.price.toLocaleString()}</p>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-secondary-grey">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:text-primary-orange transition-colors text-black/25 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-subtitle font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:text-primary-orange transition-colors text-black/25 font-bold"
                  >
                    +
                  </button>
                </div>
                <Button variant="primary" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-h3 uppercase mb-8">Features</h2>
              <p className="text-body text-black/50 whitespace-pre-line">
                {product.features}
              </p>
            </div>

            <div>
              <h2 className="text-h3 uppercase mb-8">In the Box</h2>
              <ul className="space-y-2">
                {product.includes.map((item, index) => (
                  <li key={index} className="text-body text-black/50">
                    <span className="text-primary-orange font-bold mr-4">
                      {item.quantity}x
                    </span>
                    {item.item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="bg-white rounded-lg p-8 lg:p-12">
          <h2 className="text-h3 uppercase text-center mb-12">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.others.map((other, index) => (
              <div key={index} className="text-center">
                <div className="bg-secondary-grey rounded-lg h-80 mb-8 flex items-center justify-center">
                  <p className="text-h6">{other.name}</p>
                </div>
                <h3 className="text-h5 uppercase mb-8">{other.name}</h3>
                <Button variant="primary" href={`/product/${other.slug}`}>
                  See Product
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}