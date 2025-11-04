"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const createOrder = useMutation(api.orders.createOrder);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    paymentMethod: "e-money",
    eMoneyNumber: "",
    eMoneyPin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Match schema.ts fields exactly
    const orderData = {
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone,
      shippingAddress: data.address,
      zipCode: data.zipCode,
      city: data.city,
      country: data.country,
      paymentMethod: data.paymentMethod,
      eMoneyNumber: data.eMoneyNumber || undefined,
      eMoneyPin: data.eMoneyPin || undefined,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: cartTotal,
      shipping: 50,
      vat: cartTotal * 0.2,
      grandTotal: cartTotal + 50 + cartTotal * 0.2,
      orderStatus: "pending",
      createdAt: Date.now(),
    };

    try {
      await createOrder(orderData);
      clearCart();
      alert("✅ Order placed successfully!");
    } catch (err) {
      console.error("❌ Error creating order:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Info */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Shipping Info */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            name="address"
            value={data.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">ZIP Code</label>
            <input
              name="zipCode"
              value={data.zipCode}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              name="city"
              value={data.city}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              name="country"
              value={data.country}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        {/* Payment Info */}
        <div>
          <label className="block text-sm font-medium">Payment Method</label>
          <select
            name="paymentMethod"
            value={data.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="e-money">E-Money</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>

        {data.paymentMethod === "e-money" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">E-Money Number</label>
              <input
                name="eMoneyNumber"
                value={data.eMoneyNumber}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">E-Money PIN</label>
              <input
                name="eMoneyPin"
                value={data.eMoneyPin}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-orange-500 text-white w-full py-2 rounded mt-4 hover:bg-orange-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
