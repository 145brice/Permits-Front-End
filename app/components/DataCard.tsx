'use client';

interface DataCardProps {
  label: string;
  count: number;
  color: string;
}

export default function DataCard({ label, count, color }: DataCardProps) {
  return (
    <div className="bg-black bg-opacity-80 p-4 rounded-lg text-white backdrop-blur-sm">
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`text-3xl font-bold ${color}`}>{count}</span>
      </div>
    </div>
  );
}
