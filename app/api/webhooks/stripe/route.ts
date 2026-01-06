import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'invoice.payment_succeeded') {
    // Payment was successful, log for now
    console.log('Payment successful for', event.data.object.customer_email);
  }

  return NextResponse.json({ received: true });
}