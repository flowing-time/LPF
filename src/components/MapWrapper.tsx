'use client';

import { useEffect, useState } from 'react';
import { LibraryAvailability } from '@/lib/types';
import Map from '@/components/Map'; // This imports the dynamic loading one

export default function MapWrapper() {
    const [locations, setLocations] = useState<LibraryAvailability[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/libraries');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setLocations(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="w-full h-full flex items-center justify-center bg-gray-100">Finding passes...</div>;
    }

    return <Map locations={locations} />;
}
