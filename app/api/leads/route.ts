import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Backend URL - update this to your actual backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://permits-back-end.onrender.com';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Hardcode test email as already paid
  if (email === 'test@example.com') {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leads`);
      if (response.ok) {
        const csvData = await response.text();
        return new NextResponse(csvData, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="leads.csv"',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching from backend:', error);
    }
  }

  try {
    // Find customer by email
    const customers = await stripe.customers.list({ email });
    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'No customer found' }, { status: 403 });
    }

    const customer = customers.data[0];

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
    });

    if (subscriptions.data.length > 0) {
      // Fetch actual CSV from backend
      try {
        const response = await fetch(`${BACKEND_URL}/api/leads`);
        if (response.ok) {
          const csvData = await response.text();
          return new NextResponse(csvData, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename="leads.csv"',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching from backend:', error);
      }
    }

    // Check for successful payments in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customer.id,
      created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
    });

    const successfulPayments = paymentIntents.data.filter(pi => pi.status === 'succeeded');

    if (successfulPayments.length > 0) {
      // Fetch actual CSV from backend
      try {
        const response = await fetch(`${BACKEND_URL}/api/leads`);
        if (response.ok) {
          const csvData = await response.text();
          return new NextResponse(csvData, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename="leads.csv"',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching from backend:', error);
      }
    }

    return NextResponse.json({ error: 'No active subscription or recent payment' }, { status: 403 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}