import { Availability } from './types';

interface BiblioCommonsItem {
    branchName: string;
    location: {
        name: string;
        id: string;
    };
    availability: {
        status: string; // "AVAILABLE" or "UNAVAILABLE"
    }
}

interface BiblioCommonsResponse {
    entities: {
        bibItems: Record<string, BiblioCommonsItem>;
    }
}

export async function fetchBiblioCommonsAvailability(
    libraryId: string, // 'sjpl' or 'sccl'
    bibId: string
): Promise<Availability[]> {
    const url = `https://gateway.bibliocommons.com/v2/libraries/${libraryId}/bibs/${bibId}/availability?locale=en-US`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching BiblioCommons data for ${libraryId}/${bibId}: ${response.statusText}`);
            return [];
        }
        const data: BiblioCommonsResponse = await response.json();

        // Group items by branch
        const branchCounts: Record<string, { available: number; total: number }> = {};

        if (!data.entities?.bibItems) return [];

        Object.values(data.entities.bibItems).forEach((item) => {
            const branch = item.branchName || item.location?.name;
            if (!branch) return;

            if (!branchCounts[branch]) {
                branchCounts[branch] = { available: 0, total: 0 };
            }

            branchCounts[branch].total += 1;
            if (item.availability?.status === 'AVAILABLE') {
                branchCounts[branch].available += 1;
            }
        });

        return Object.entries(branchCounts).map(([branchName, counts]) => ({
            branchName,
            available: counts.available,
            total: counts.total,
            status: (counts.available > 0 ? 'Available' : 'Unavailable') as const
        }));

    } catch (error) {
        console.error(`Failed to fetch BiblioCommons data for ${libraryId}`, error);
        return [];
    }
}
