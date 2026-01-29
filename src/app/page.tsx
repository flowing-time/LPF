'use client';

import { useState } from 'react';
import MapWrapper, { PassType } from '@/components/MapWrapper';

export default function Home() {
  const [passType, setPassType] = useState<PassType>('caState');

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <header className="bg-white border-b px-4 py-3 shadow-sm z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Library Pass Finder 🌲</h1>

        {/* Toggle Button */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setPassType('caState')}
            className={`px-3 py-1 text-xs rounded-full transition-all ${passType === 'caState'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            CA State Pass
          </button>
          <button
            onClick={() => setPassType('sccCounty')}
            className={`px-3 py-1 text-xs rounded-full transition-all ${passType === 'sccCounty'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            County Pass
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        <MapWrapper passType={passType} />
      </main>
    </div>
  );
}
