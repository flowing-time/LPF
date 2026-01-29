'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LibraryAvailability } from '@/lib/types';
import L from 'leaflet';
import { useMemo, useState, useEffect } from 'react';
import { PassType } from '../MapWrapper';

interface MapProps {
    locations: LibraryAvailability[];
    passType: PassType;
}

const CENTER_LAT = 37.3382;
const CENTER_LNG = -121.8863;
const ZOOM_LEVEL = 10;

function getStatusColor(loc: LibraryAvailability, passType: PassType, mvOverride?: { available: number, total: number } | null) {
    let pass = passType === 'caState' ? loc.availability.caStatePass : loc.availability.sccCountyPass;

    // Override logic for MV CA State Pass if data exists
    if (loc.system === 'MountainView' && passType === 'caState' && mvOverride) {
        const status = mvOverride.available > 0 ? 'Available' : 'Unavailable';
        pass = { ...pass, status: status as any, available: mvOverride.available, total: mvOverride.total };
    }

    if (pass.status === 'Available') return 'bg-green-500';
    if (pass.status === 'Check Library') return 'bg-orange-500';
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

export default function Map({ locations, passType }: MapProps) {
    const [mvData, setMvData] = useState<{ available: number, total: number } | null>(null);

    // Client-side fetch for Mountain View (disabled since Puppeteer handles it)
    useEffect(() => {
        // MV data is now fetched via Puppeteer on server, so we don't need client-side fetch
    }, []);

    const greenIcon = useMemo(() => createIcon('bg-green-500'), []);
    const orangeIcon = useMemo(() => createIcon('bg-orange-500'), []);
    const redIcon = useMemo(() => createIcon('bg-red-500'), []);

    const getIcon = (loc: LibraryAvailability) => {
        const color = getStatusColor(loc, passType, loc.system === 'MountainView' ? mvData : null);
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
            {locations.map((loc) => {
                // Get the pass data for the selected type
                let pass = passType === 'caState' ? loc.availability.caStatePass : loc.availability.sccCountyPass;

                // Apply MV override for CA State Pass (from Puppeteer data already in loc)
                // No client-side override needed now

                const passLabel = passType === 'caState' ? 'CA State Pass' : 'County Pass';

                return (
                    <Marker
                        key={loc.id}
                        position={[loc.lat, loc.lng]}
                        icon={getIcon(loc)}
                    >
                        <Popup className="min-w-[180px]">
                            <div className="p-1">
                                <h3 className="font-bold text-sm mb-1">{loc.name}</h3>
                                <p className="text-xs text-gray-500 mb-2">{loc.address}</p>

                                <div className="flex justify-between items-center text-xs">
                                    <span>{passLabel}:</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-white ${pass.status === 'Available' ? 'bg-green-500' :
                                            pass.status === 'Check Library' ? 'bg-orange-400' : 'bg-red-500'
                                        }`}>
                                        {pass.status === 'Check Library' ? 'Check' : `${pass.available} / ${pass.total}`}
                                    </span>
                                </div>

                                {loc.phone && <p className="text-xs mt-2 text-gray-400 text-center">{loc.phone}</p>}
                            </div>
                        </Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    );
}
