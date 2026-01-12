import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// API route to get map leads data (Austin permits)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  // No longer require email - show all leads publicly
  // But track if user is authenticated for address visibility
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5002';
    
    // Call backend to get permit data for mapping
    const response = await fetch(`${backendUrl}/last-week?cities=austin`);
    
    if (!response.ok) {
      // Fallback to mock data if backend fails
      console.error('Backend call failed, using mock data');
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

    return NextResponse.json({ 
      leads: mapLeads,
      isAuthenticated: !!email // Simplified - any email provided means authenticated
    });
    }

    const backendData = await response.json();
    
    // Transform backend data to map format
    const mapLeads: any[] = [];
    for (const [city, cityData] of Object.entries(backendData)) {
      const cityInfo = cityData as any;
      if (cityInfo.permits) {
        cityInfo.permits.forEach((permit: any) => {
          // Add some randomization to coordinates for mapping
          mapLeads.push({
            address: permit.address || permit.description || 'Unknown Address',
            lat: 30.2672 + (Math.random() - 0.5) * 0.2, // Austin coordinates with randomization
            lng: -97.7431 + (Math.random() - 0.5) * 0.2,
            type: 'permit',
            description: permit.description || 'Permit activity',
            price: undefined,
          });
        });
      }
    }

    return NextResponse.json({ 
      leads: mapLeads,
      isAuthenticated: !!email // Simplified - any email provided means authenticated
    });
  } catch (error) {
    console.error('Error fetching map leads:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
