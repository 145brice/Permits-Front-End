import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import * as fs from 'fs';
import * as path from 'path';

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

  // Fetch the latest CSV file for the specified city
  try {
    const leadsDir = path.join(process.cwd(), 'leads', city.toLowerCase());
    
    if (!fs.existsSync(leadsDir)) {
      return NextResponse.json({ error: `No data available for ${city}` }, { status: 404 });
    }

    // Get all date folders and sort to get the latest
    const dateFolders = fs.readdirSync(leadsDir)
      .filter(folder => {
        const folderPath = path.join(leadsDir, folder);
        return fs.statSync(folderPath).isDirectory();
      })
      .sort()
      .reverse();

    if (dateFolders.length === 0) {
      return NextResponse.json({ error: `No data available for ${city}` }, { status: 404 });
    }

    const latestDateFolder = dateFolders[0];
    const latestFolderPath = path.join(leadsDir, latestDateFolder);
    
    // Get CSV file from the latest date folder
    const csvFiles = fs.readdirSync(latestFolderPath).filter(file => file.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      return NextResponse.json({ error: `No CSV file found for ${city}` }, { status: 404 });
    }

    const csvFilePath = path.join(latestFolderPath, csvFiles[0]);
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${latestDateFolder}_${city}_leads.csv"`,
      },
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ error: 'Error fetching leads data' }, { status: 500 });
  }
}