import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const city = searchParams.get('city') || 'austin'; // Default to Austin

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Admin/paid emails that bypass Stripe check
  const paidEmails = [
    'test@example.com',
    'admin@permits.com',
    '145brice@gmail.com',
  ];

  // Check if user has access
  const hasAccess = paidEmails.includes(email.toLowerCase());

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