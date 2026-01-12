import { NextRequest, NextResponse } from 'next/server';

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
      // Backend call failed - return empty leads
      console.error('Backend call failed:', response.status);
      return NextResponse.json({ 
        leads: [],
        isAuthenticated: !!email,
        error: 'No permit data available. Scrapers may not have run yet.'
      });
    }

    const backendData = await response.json();
    
    // Transform backend data to map format
    const mapLeads: any[] = [];
    for (const [city, cityData] of Object.entries(backendData)) {
      const cityInfo = cityData as any;
      if (cityInfo.permits) {
        cityInfo.permits.forEach((permit: any) => {
          // Use real coordinates from backend geocoding, skip if no coords
          if (permit.lat && permit.lng) {
            mapLeads.push({
              address: permit.address || 'Unknown Address',
              lat: permit.lat,
              lng: permit.lng,
              type: 'permit',
              description: permit.description || 'Permit activity',
              date: permit.date,
              permit_number: permit.permit_number,
            });
          }
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
