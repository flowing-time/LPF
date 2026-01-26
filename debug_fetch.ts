
async function main() {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    console.log('--- 1. Testing SJPL Availability Structure ---');
    try {
        const url = 'https://gateway.bibliocommons.com/v2/libraries/sjpl/bibs/S156C6422417/availability?locale=en-US';
        const res = await fetch(url, { headers });
        if (!res.ok) console.log('SJPL Avail Status:', res.status);
        else {
            const data = await res.json();
            console.log('SJPL Keys:', Object.keys(data));
            if (data.entities && data.entities.bibItems) {
                console.log('BibItems Keys sample:', Object.keys(data.entities.bibItems).slice(0, 3));
                const first = Object.values(data.entities.bibItems)[0];
                console.log('First Item:', JSON.stringify(first, null, 2));
            } else {
                console.log('Unexpected SJPL structure:', JSON.stringify(data, null, 2).substring(0, 500));
            }
        }
    } catch (e) { console.error('SJPL Avail Error:', e); }

    console.log('\n--- 2. Testing Locations API (SJPL) ---');
    try {
        const url = 'https://gateway.bibliocommons.com/v2/libraries/sjpl/locations?locale=en-US';
        const res = await fetch(url, { headers });
        if (!res.ok) console.log('SJPL Loc Status:', res.status);
        else {
            const data = await res.json();
            // Inspect structure. Typically data.entities.locations or similar?
            console.log('SJPL Loc Response Keys:', Object.keys(data));
            if (data.entities && data.entities.locations) {
                const locs = Object.values(data.entities.locations);
                console.log(`Found ${locs.length} locations.`);
                console.log('First Location:', JSON.stringify(locs[0], null, 2));
            } else {
                console.log('Unexpected Loc structure:', JSON.stringify(data).substring(0, 200));
            }
        }
    } catch (e) { console.error('SJPL Loc Error:', e); }

    console.log('\n--- 3. Mountain View API ---');
    try {
        const url = 'https://na5.iiivega.com/api/gates-edge/gates/resource-count?bibIds=3087456';
        const response = await fetch(url, {
            headers: {
                'Origin': 'https://librarycatalog.mountainview.gov',
                'Referer': 'https://librarycatalog.mountainview.gov/',
                ...headers
            }
        });
        console.log('MV Status:', response.status);
        const text = await response.text();
        console.log('MV Body:', text.substring(0, 500));
    } catch (e) {
        console.error('MV Error:', e);
    }

}

main();
