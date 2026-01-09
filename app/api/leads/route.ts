import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const city = searchParams.get('city') || 'austin'; // Default to Austin

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Test/Admin emails that bypass Stripe check
  const testEmails = [
    'test@example.com',
    'admin@permits.com',
    '145brice@gmail.com',
  ];

  let hasAccess = false;

  // Check if this is a test/admin email
  if (testEmails.includes(email.toLowerCase())) {
    hasAccess = true;
  } else {
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
        hasAccess = true;
      } else {
        // Check for successful payments in the last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const paymentIntents = await stripe.paymentIntents.list({
          customer: customer.id,
          created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
        });

        const successfulPayments = paymentIntents.data.filter(pi => pi.status === 'succeeded');
        if (successfulPayments.length > 0) {
          hasAccess = true;
        }
      }
    } catch (error) {
      console.error('Stripe error:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

  if (!hasAccess) {
    return NextResponse.json({ error: 'No active subscription or recent payment' }, { status: 403 });
  }

  // Proxy request to backend API
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5002';
    const response = await fetch(`${backendUrl}/api/get-leads?city=${city}&customer_id=${email}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    // Get the CSV file from backend
    const csvData = await response.text();
    const filename = `${city}_leads.csv`;

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Backend fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from backend' }, { status: 500 });
  }
}