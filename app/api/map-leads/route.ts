import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// API route to get map leads data (Austin permits)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Test/Admin emails that bypass Stripe check
  const testEmails = [
    'test@example.com',
    'admin@permits.com',
    '145brice@gmail.com', // Your email
  ];

  // Check if this is a test/admin email - skip Stripe verification
  if (!testEmails.includes(email.toLowerCase())) {
    try {
      // Check if user has active subscription or recent payment
      const customers = await stripe.customers.list({ email, limit: 1 });
      
      if (customers.data.length === 0) {
        return NextResponse.json({ error: 'No payment found. Please subscribe first.' }, { status: 403 });
      }

      const customerId = customers.data[0].id;

      // Check for active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        // Check for recent payment (within 30 days)
        const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
        const payments = await stripe.paymentIntents.list({
          customer: customerId,
          created: { gte: thirtyDaysAgo },
          limit: 1,
        });

        if (payments.data.length === 0 || payments.data[0].status !== 'succeeded') {
          return NextResponse.json({ error: 'No active subscription or recent payment found.' }, { status: 403 });
        }
      }
    } catch (error) {
      console.error('Error checking Stripe:', error);
      return NextResponse.json({ error: 'Failed to verify payment status' }, { status: 500 });
    }
  }

  // User is authorized - return map leads data
  try {
    // Transform CSV data to map format with geocoding
    // For now, return mock data with Austin coordinates
    const mapLeads = [
      {
        address: '4007 EDGEROCK DR',
        lat: 30.2672 + (Math.random() - 0.5) * 0.1,
        lng: -97.7431 + (Math.random() - 0.5) * 0.1,
        type: 'permit',
        description: 'Residential Expedited Review - New construction',
      },
      {
        address: '5106 CLOVERDALE LN',
        lat: 30.2672 + (Math.random() - 0.5) * 0.1,
        lng: -97.7431 + (Math.random() - 0.5) * 0.1,
        type: 'permit',
        description: 'Water heater replacement',
      },
      {
        address: '1501 HARDOUIN AVE',
        lat: 30.2672 + (Math.random() - 0.5) * 0.1,
        lng: -97.7431 + (Math.random() - 0.5) * 0.1,
        type: 'permit',
        description: 'Whole home generator installation',
      },
      // Add more sample data
      ...Array.from({ length: 20 }, (_, i) => ({
        address: `${1000 + i * 100} Sample St`,
        lat: 30.2672 + (Math.random() - 0.5) * 0.2,
        lng: -97.7431 + (Math.random() - 0.5) * 0.2,
        type: 'permit',
        description: 'New construction permit',
      })),
    ];

    return NextResponse.json({ leads: mapLeads });
  } catch (error) {
    console.error('Error fetching map leads:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
