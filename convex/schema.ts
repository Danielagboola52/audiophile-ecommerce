import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    // 🧍 Customer details
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),

    // 🚚 Shipping details
    shippingAddress: v.string(),
    zipCode: v.string(),
    city: v.string(),
    country: v.string(),

    // 💳 Payment details
    paymentMethod: v.string(), // "e-money" or "cash"
    eMoneyNumber: v.optional(v.string()),
    eMoneyPin: v.optional(v.string()),

    // 📦 Order items
    items: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
      })
    ),

    // 💰 Totals
    subtotal: v.number(),
    shipping: v.number(),
    vat: v.number(),
    grandTotal: v.number(),

    // 🕒 Metadata
    orderStatus: v.string(), // "pending", "confirmed", "shipped", "delivered"
    createdAt: v.number(),
  })
    // 📧 Index for fetching orders by email
    .index("by_email", ["customerEmail"])
    // 📅 Index for sorting orders by creation date
    .index("by_creation_at", ["createdAt"]),
});
