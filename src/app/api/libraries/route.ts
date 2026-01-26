import { NextResponse } from 'next/server';
import { LIBRARY_CONFIGS, LOCATIONS } from '@/lib/constants';
import { fetchBiblioCommonsAvailability } from '@/lib/bibliocommons';
import { Availability, LibraryAvailability } from '@/lib/types';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    const allLocations: LibraryAvailability[] = JSON.parse(JSON.stringify(LOCATIONS));

    // Initialize availability structure
    allLocations.forEach(loc => {
        loc.availability = {
            caStatePass: { branchName: loc.name, available: 0, total: 0, status: 'Unavailable' as const },
            sccCountyPass: { branchName: loc.name, available: 0, total: 0, status: 'Unavailable' as const }
        };
    });

    // Fetch all data in parallel
    const promises = LIBRARY_CONFIGS.map(async (config) => {
        const results: { type: string, data: Availability[] }[] = [];

        if (config.apiId === 'mv') {
            // Return dummy availability with "Check Library" status
            return {
                config,
                results: [{
                    type: 'caState',
                    data: [{
                        branchName: 'Mountain View Public Library',
                        available: 0,
                        total: 0,
                        status: 'Check Library'
                    }]
                }]
            };
        }

        // BiblioCommons Systems
        for (const pass of config.passes) {
            const avail = await fetchBiblioCommonsAvailability(config.apiId, pass.bibId);
            results.push({ type: pass.type, data: avail });
        }
        return { config, results };
    });

    const responses = await Promise.all(promises);

    // Map results back to locations
    responses.forEach(({ config, results }) => {
        results.forEach(({ type, data }) => {
            data.forEach(item => {
                // Find matching location
                // Try to match by branchName ("Almaden") to loc.name ("Almaden")
                // Or loc.name ("Cupertino Library") vs item.branchName ("Cupertino Library")
                let loc = allLocations.find(l =>
                    l.system === config.systemName && // This might mismatch "SJPL" vs "San José Public Library"
                    (l.name === item.branchName || l.name.toLowerCase().includes(item.branchName.toLowerCase()))
                );

                // Fix system matching: LOCATIONS use 'SJPL', 'SCCLD', 'SantaClaraCity'.
                // CONFIGS use 'sjpl', 'sccl', ...
                // I need to map config.id to Location System code or just use flexible matching.
                if (!loc) {
                    // Try strict system code match
                    loc = allLocations.find(l => {
                        const sysMatch = (config.id === 'sjpl' && l.system === 'SJPL') ||
                            (config.id === 'sccl' && l.system === 'SCCLD') ||
                            (config.id === 'sclibrary' && l.system === 'SantaClaraCity');
                        if (!sysMatch) return false;

                        // Name match
                        // SJPL: "Almaden" == "Almaden"
                        // SCCLD: "Cupertino Library" == "Cupertino Library"?
                        return l.name === item.branchName ||
                            l.name.replace(' Library', '') === item.branchName.replace(' Library', '') ||
                            item.branchName.includes(l.name);
                    });
                }

                if (loc) {
                    if (type === 'caState') {
                        loc.availability.caStatePass = item;
                    } else if (type === 'sccCounty') {
                        loc.availability.sccCountyPass = item;
                    }
                }
            });
        });
    });

    return NextResponse.json(allLocations);
}
