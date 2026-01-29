'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LibraryAvailability } from '@/lib/types';
import L from 'leaflet';
import { useMemo } from 'react';

// Fix for default markers in Next.js
// We'll use custom DivIcons instead to avoid asset loading issues and allow easy coloring

interface MapProps {
    locations: LibraryAvailability[];
}

const CENTER_LAT = 37.3382;
const CENTER_LNG = -121.8863;
const ZOOM_LEVEL = 10;

function getStatusColor(loc: LibraryAvailability) {
    const ca = loc.availability.caStatePass;
    const scc = loc.availability.sccCountyPass;

    // Priority: Available > Check Library > Unavailable
    if (ca.status === 'Available' || scc.status === 'Available') return 'bg-green-500';
    if (ca.status === 'Check Library' || scc.status === 'Check Library') return 'bg-orange-500';
    return 'bg-red-500';
}

function createIcon(colorClass: string) {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md ${colorClass}"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -4],
    });
}

export default function Map({ locations }: MapProps) {

    // Memoize icons to avoid recreation
    const greenIcon = useMemo(() => createIcon('bg-green-500'), []);
    const orangeIcon = useMemo(() => createIcon('bg-orange-500'), []);
    const redIcon = useMemo(() => createIcon('bg-red-500'), []);

    const getIcon = (loc: LibraryAvailability) => {
        const color = getStatusColor(loc);
        if (color === 'bg-green-500') return greenIcon;
        if (color === 'bg-orange-500') return orangeIcon;
        return redIcon;
    };

    return (
        <MapContainer
            center={[CENTER_LAT, CENTER_LNG]}
            zoom={ZOOM_LEVEL}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
                <Marker
                    key={loc.id}
                    position={[loc.lat, loc.lng]}
                    icon={getIcon(loc)}
                >
                    <Popup className="min-w-[200px]">
                        <div className="p-1">
                            <h3 className="font-bold text-sm mb-1">{loc.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{loc.address}</p>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                    <span>CA State Pass:</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-white ${loc.availability.caStatePass.status === 'Available' ? 'bg-green-500' :
                                        loc.availability.caStatePass.status === 'Check Library' ? 'bg-orange-400' : 'bg-red-500'
                                        }`}>
                                        {loc.availability.caStatePass.status === 'Check Library' ? 'Check' : `${loc.availability.caStatePass.available} / ${loc.availability.caStatePass.total}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span>County Pass:</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-white ${loc.availability.sccCountyPass.status === 'Available' ? 'bg-green-500' :
                                        loc.availability.sccCountyPass.status === 'Check Library' ? 'bg-orange-400' : 'bg-red-500'
                                        }`}>
                                        {loc.availability.sccCountyPass.status === 'Check Library' ? 'Check' : `${loc.availability.sccCountyPass.available} / ${loc.availability.sccCountyPass.total}`}
                                    </span>
                                </div>
                            </div>

                            {loc.phone && <p className="text-xs mt-2 text-gray-400">{loc.phone}</p>}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
