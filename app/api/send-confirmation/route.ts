import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, orderId, items, grandTotal } = await request.json();

    const itemsList = items
      .map(
        (item: any) =>
          `<tr>
            <td style="padding: 12px; border-bottom: 1px solid #f1f1f1;">
              <strong>${item.shortName}</strong>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #f1f1f1;">
              $${item.price.toLocaleString()}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #f1f1f1;">
              x${item.quantity}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #f1f1f1; text-align: right;">
              <strong>$${(item.price * item.quantity).toLocaleString()}</strong>
            </td>
          </tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #D87D4A; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">audiophile</h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="color: #D87D4A; margin: 0 0 10px 0;">✓ Order Confirmed</h2>
              <p style="margin: 0; font-size: 16px;">Thank you for your order, ${name}!</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; margin-bottom: 15px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f1f1f1;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 20px 12px 12px; text-align: right; font-size: 18px;">
                      <strong>Grand Total:</strong>
                    </td>
                    <td style="padding: 20px 12px 12px; text-align: right; font-size: 18px; color: #D87D4A;">
                      <strong>$${grandTotal.toLocaleString()}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="margin: 0 0 15px 0;"><strong>What happens next?</strong></p>
              <p style="margin: 5px 0;">✓ We're processing your order</p>
              <p style="margin: 5px 0;">✓ You'll receive a shipping confirmation soon</p>
              <p style="margin: 5px 0;">✓ Estimated delivery: 3-5 business days</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e0e0e0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" 
                 style="display: inline-block; background-color: #D87D4A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                View Your Order
              </a>
            </div>

            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
              <p>Need help? Contact us at <a href="mailto:support@audiophile.com" style="color: #D87D4A;">support@audiophile.com</a></p>
              <p style="margin-top: 20px;">© 2024 Audiophile. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Audiophile <onboarding@resend.dev>',
      to: [email],
      subject: `Order Confirmation - ${orderId}`,
      html: html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}