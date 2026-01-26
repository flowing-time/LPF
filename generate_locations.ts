import fs from 'fs';
import path from 'path';

interface LocationRaw {
    id: string;
    name: string;
    address?: {
        street: string;
        number: string;
        city: string;
        state: string;
        zip: string;
    };
    mapLocation?: {
        centrePoint: {
            lat: number;
            lng: number;
        }
    };
    branchContacts?: {
        contactType: string;
        value: string;
    }[];
}

interface LibrarySystemConfig {
    id: string; // API ID
    name: string; // Human Readable
    systemId: 'SJPL' | 'SCCLD' | 'SantaClaraCity' | 'MountainView';
}

const SYSTEMS: LibrarySystemConfig[] = [
    { id: 'sjpl', name: 'San José Public Library', systemId: 'SJPL' },
    { id: 'sccl', name: 'Santa Clara County Library District', systemId: 'SCCLD' },
    // { id: 'sclibrary', name: 'Santa Clara City Library', systemId: 'SantaClaraCity' }, // API failing
];

interface OutputLocation {
    id: string; // unique: system-branchId
    system: string;
    name: string;
    branchId: string; // internal id
    address: string;
    lat: number;
    lng: number;
    phone?: string;
    url?: string;
}

const MANUAL_LOCATIONS: OutputLocation[] = [
    {
        id: 'sclibrary-central',
        system: 'SantaClaraCity',
        name: 'Central Park Library',
        branchId: 'central',
        address: '2635 Homestead Rd, Santa Clara, CA 95051',
        lat: 37.3486,
        lng: -121.9754,
        phone: '(408) 615-2900'
    },
    {
        id: 'sclibrary-northside',
        system: 'SantaClaraCity',
        name: 'Northside Branch Library',
        branchId: 'northside',
        address: '695 Moreland Way, Santa Clara, CA 95054',
        lat: 37.3995,
        lng: -121.9442,
        phone: '(408) 615-5500'
    },
    {
        id: 'sclibrary-mission',
        system: 'SantaClaraCity',
        name: 'Mission Branch Library',
        branchId: 'mission',
        address: '1098 Lexington St, Santa Clara, CA 95050',
        lat: 37.3551,
        lng: -121.9446,
        phone: '(408) 615-2964'
    },
    {
        id: 'mv-main',
        system: 'MountainView',
        name: 'Mountain View Public Library',
        branchId: 'main',
        address: '585 Franklin St, Mountain View, CA 94041',
        lat: 37.3926,
        lng: -122.0833,
        phone: '(650) 903-6337'
    }
];

async function fetchLocations(sys: LibrarySystemConfig): Promise<OutputLocation[]> {
    console.log(`Fetching ${sys.name}...`);
    // Added limit=100
    const url = `https://gateway.bibliocommons.com/v2/libraries/${sys.id}/locations?locale=en-US&limit=100`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        const locs: LocationRaw[] = Object.values(data.entities.locations);

        return locs.map(l => {
            let address = '';
            if (l.address) {
                address = `${l.address.number || ''} ${l.address.street || ''}, ${l.address.city}, ${l.address.state} ${l.address.zip}`;
                address = address.trim().replace(/\s+/, ' ');
            }

            const phone = l.branchContacts?.find(c => c.contactType === 'phone')?.value;

            return {
                id: `${sys.id}-${l.id}`,
                system: sys.systemId,
                name: l.name,
                branchId: l.id,
                address: address,
                lat: l.mapLocation?.centrePoint.lat || 0,
                lng: l.mapLocation?.centrePoint.lng || 0,
                phone,
            };
        });
    } catch (e) {
        console.error(`Error fetching ${sys.name}:`, e);
        return [];
    }
}

async function main() {
    const allLocations: OutputLocation[] = [];
    for (const sys of SYSTEMS) {
        const locs = await fetchLocations(sys);
        allLocations.push(...locs);
    }

    // Add manual loctions
    allLocations.push(...MANUAL_LOCATIONS);

    const outputPath = path.join(process.cwd(), 'src/lib/data/locations.json');
    // Ensure dir exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(outputPath, JSON.stringify(allLocations, null, 2));
    console.log(`Saved ${allLocations.length} locations to src/lib/data/locations.json`);
}

main();
