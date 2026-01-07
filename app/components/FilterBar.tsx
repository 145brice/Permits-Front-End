'use client';

interface FilterBarProps {
  onFilter: (type: string) => void;
  onZipChange: (zip: string) => void;
}

export default function FilterBar({ onFilter, onZipChange }: FilterBarProps) {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg z-[1000] backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="text"
          placeholder="Zip code..."
          className="bg-transparent border-b border-white text-white placeholder-gray-400 px-2 py-1 focus:outline-none focus:border-blue-400"
          onChange={(e) => onZipChange(e.target.value)}
        />
        <button
          className="text-sm px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded transition-colors"
          onClick={() => onFilter('permit')}
        >
          🔨 Permits Only
        </button>
        <button
          className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
          onClick={() => onFilter('sold')}
        >
          🏡 Sales Only
        </button>
        <button
          className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
          onClick={() => onFilter('all')}
        >
          All
        </button>
      </div>
    </div>
  );
}
