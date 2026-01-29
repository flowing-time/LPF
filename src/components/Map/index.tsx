'use client';

import dynamic from 'next/dynamic';
import { LibraryAvailability } from '@/lib/types';

// Explicitly type the dynamic component props
const Map = dynamic<{ locations: LibraryAvailability[] }>(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            Loading map...
        </div>
    ),
});

export default Map;
