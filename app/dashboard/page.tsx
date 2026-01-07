'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import FilterBar from '../components/FilterBar';
import DataCard from '../components/DataCard';

// Import MapView dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading map...</p>
    </div>
  ),
});

interface Lead {
  address: string;
  lat: number;
  lng: number;
  price?: string;
  type: 'sold' | 'permit';
  description?: string;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const fetchLeads = async (userEmail: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/map-leads?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Access denied');
        setIsUnlocked(false);
        return;
      }

      setLeads(data.leads);
      setFilteredLeads(data.leads);
      setIsUnlocked(true);
      setError('');
      // Store email in localStorage for persistence
      localStorage.setItem('dashboardEmail', userEmail);
    } catch (err) {
      setError('Failed to load leads');
      setIsUnlocked(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if email is stored
    const storedEmail = localStorage.getItem('dashboardEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchLeads(storedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await fetchLeads(email);
  };

  const handleFilter = (type: string) => {
    if (type === 'all') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.type === type));
    }
  };

  const handleZipChange = (zip: string) => {
    // Implement zip filtering logic if needed
    console.log('Filter by zip:', zip);
  };

  const soldCount = filteredLeads.filter((l) => l.type === 'sold').length;
  const permitCount = filteredLeads.filter((l) => l.type === 'permit').length;

  // Locked page
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl max-w-md w-full border border-white border-opacity-20">
          <h1 className="text-4xl font-bold text-white mb-4">
            🗺️ Construction Leads Dashboard
          </h1>
          <p className="text-gray-300 mb-6">
            Interactive map showing sold homes and active permits in Austin. Subscribe to unlock.
          </p>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/pricing" className="text-blue-400 hover:text-blue-300 underline">
              Don't have access? Subscribe here
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked dashboard
  return (
    <div className="bg-black text-white h-screen w-screen overflow-hidden relative">
      <FilterBar onFilter={handleFilter} onZipChange={handleZipChange} />
      <MapView leads={filteredLeads} />
      
      {/* Data Cards */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-[1000]">
        <DataCard label="Sold Homes" count={soldCount} color="text-blue-400" />
        <DataCard label="Active Permits" count={permitCount} color="text-orange-400" />
        <DataCard label="Total Leads" count={filteredLeads.length} color="text-green-400" />
      </div>

      {/* Refresh button */}
      <button
        onClick={() => fetchLeads(email)}
        className="absolute top-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg z-[1000] backdrop-blur-sm hover:bg-opacity-100 transition-all"
      >
        🔄 Refresh
      </button>
    </div>
  );
}
