'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Image from 'next/image';

// Form validation schema
const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.enum(['e-money', 'cash']),
  eMoneyNumber: z.string().optional(),
  eMoneyPin: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === 'e-money') {
    return data.eMoneyNumber && data.eMoneyNumber.length >= 9;
  }
  return true;
}, {
  message: 'e-Money number is required',
  path: ['eMoneyNumber'],
}).refine((data) => {
  if (data.paymentMethod === 'e-money') {
    return data.eMoneyPin && data.eMoneyPin.length >= 4;
  }
  return true;
}, {
  message: 'e-Money PIN is required',
  path: ['eMoneyPin'],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const createOrder = useMutation(api.orders.createOrder);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'e-money',
    },
  });

  const paymentMethod = watch('paymentMethod');
  const shipping = 50;
  const vat = Math.round(total * 0.2);
  const grandTotal = total + shipping;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Create order in Convex
      const newOrderId = await createOrder({
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        shippingAddress: data.address,
        shippingCity: data.city,
        shippingZipCode: data.zipCode,
        shippingCountry: data.country,
        paymentMethod: data.paymentMethod,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: total,
        shipping: shipping,
        vat: vat,
        grandTotal: grandTotal,
        status: 'pending',
      });

      // Send confirmation email
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          orderId: newOrderId,
          items: cart,
          total: grandTotal,
          shippingAddress: `${data.address}, ${data.city}, ${data.zipCode}, ${data.country}`,
        }),
      });

      setOrderId(newOrderId as string);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handleBackToHome = () => {
    clearCart();
    setShowConfirmation(false);
    router.push('/');
  };

  // Redirect if cart is empty
  if (cart.length === 0 && !showConfirmation) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <h2 className="text-h5 mb-4">Your cart is empty</h2>
          <p className="text-body text-black/50 mb-6">
            Add some products to checkout
          </p>
          <Button variant="primary" onClick={() => router.push('/')}>
            GO TO HOME
          </Button>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-primary-orange rounded-full flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M9 16L14 21L23 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="text-h5 mb-4">THANK YOU<br />FOR YOUR ORDER</h2>
          <p className="text-body text-black/50 mb-6">
            You will receive an email confirmation shortly.
          </p>

          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                {cart[0]?.image ? (
                  <Image
                    src={cart[0].image}
                    alt={cart[0].name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold">{cart[0]?.shortName || cart[0]?.name}</p>
                <p className="text-sm text-black/50">x{cart[0]?.quantity}</p>
              </div>
              <p className="font-bold">${cart[0]?.price.toLocaleString()}</p>
            </div>
            {cart.length > 1 && (
              <p className="text-xs text-black/50 text-center pt-4 border-t">
                and {cart.length - 1} other item(s)
              </p>
            )}
          </div>

          <div className="bg-black text-white rounded-lg p-6 mb-6">
            <p className="text-sm text-white/50 mb-2">GRAND TOTAL</p>
            <p className="text-h6">${grandTotal.toLocaleString()}</p>
          </div>

          <Button variant="primary" onClick={handleBackToHome}>
            BACK TO HOME
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-black/50 hover:text-primary-orange mb-6"
        >
          Go Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-white rounded-lg p-8">
            <h1 className="text-h3 mb-8">CHECKOUT</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Billing Details */}
              <div className="mb-8">
                <h2 className="text-subtitle text-primary-orange mb-4">BILLING DETAILS</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2">Name</label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="Alexei Ward"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2">Email Address</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="alexei@mail.com"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2">Phone Number</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="+1 202-555-0136"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mb-8">
                <h2 className="text-subtitle text-primary-orange mb-4">SHIPPING INFO</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2">Address</label>
                    <input
                      {...register('address')}
                      type="text"
                      placeholder="1137 Williams Avenue"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-2">ZIP Code</label>
                      <input
                        {...register('zipCode')}
                        type="text"
                        placeholder="10001"
                        className={`w-full px-4 py-3 border rounded-lg ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.zipCode && (
                        <p className="text-xs text-red-500 mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2">City</label>
                      <input
                        {...register('city')}
                        type="text"
                        placeholder="New York"
                        className={`w-full px-4 py-3 border rounded-lg ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2">Country</label>
                    <input
                      {...register('country')}
                      type="text"
                      placeholder="United States"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.country && (
                      <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h2 className="text-subtitle text-primary-orange mb-4">PAYMENT DETAILS</h2>
                
                <div className="mb-4">
                  <label className="block text-xs font-bold mb-2">Payment Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-primary-orange">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="e-money"
                        className="w-5 h-5"
                      />
                      <span className="font-bold">e-Money</span>
                    </label>

                    <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-primary-orange">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="cash"
                        className="w-5 h-5"
                      />
                      <span className="font-bold">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'e-money' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-2">e-Money Number</label>
                      <input
                        {...register('eMoneyNumber')}
                        type="text"
                        placeholder="238521993"
                        className={`w-full px-4 py-3 border rounded-lg ${
                          errors.eMoneyNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.eMoneyNumber && (
                        <p className="text-xs text-red-500 mt-1">{errors.eMoneyNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2">e-Money PIN</label>
                      <input
                        {...register('eMoneyPin')}
                        type="text"
                        placeholder="6891"
                        className={`w-full px-4 py-3 border rounded-lg ${
                          errors.eMoneyPin ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.eMoneyPin && (
                        <p className="text-xs text-red-500 mt-1">{errors.eMoneyPin.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-8 h-fit">
            <h2 className="text-h6 mb-6">SUMMARY</h2>

            {/* Cart Items */}
            <div className="space-y-6 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.shortName || item.name}</p>
                    <p className="text-sm text-black/50">${item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-black/50">x{item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-body">
                <span className="text-black/50">TOTAL</span>
                <span className="font-bold">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-black/50">SHIPPING</span>
                <span className="font-bold">${shipping}</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-black/50">VAT (INCLUDED)</span>
                <span className="font-bold">${vat.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-body mb-8">
              <span className="text-black/50">GRAND TOTAL</span>
              <span className="font-bold text-primary-orange">${grandTotal.toLocaleString()}</span>
            </div>

            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? 'PROCESSING...' : 'CONTINUE & PAY'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}