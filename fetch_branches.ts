import { fetchBiblioCommonsAvailability } from './src/lib/bibliocommons';

async function main() {
    console.log('--- SJPL (SJPL) ---');
    // CA State Parks Pass
    const sjpl = await fetchBiblioCommonsAvailability('sjpl', 'S156C6422417');
    console.log(sjpl.map(b => b.branchName).join('\n'));

    console.log('\n--- SCCLD (SCCL) ---');
    // CA State Parks Pass
    const sccld = await fetchBiblioCommonsAvailability('sccl', 'S118C1014941');
    console.log(sccld.map(b => b.branchName).join('\n'));

    console.log('\n--- Santa Clara City (SCLIBRARY) ---');
    // CA State Parks Pass
    const sccity = await fetchBiblioCommonsAvailability('sclibrary', 'S146C2454429');
    console.log(sccity.map(b => b.branchName).join('\n'));

    console.log('\n--- Mountain View (Vega API) ---');
    try {
        const url = 'https://na5.iiivega.com/api/gates-edge/gates/resource-count?bibIds=3087456';
        const response = await fetch(url, {
            headers: {
                'Origin': 'https://librarycatalog.mountainview.gov',
                'Referer': 'https://librarycatalog.mountainview.gov/',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (response.ok) {
            const text = await response.text();
            console.log('Response:', text);
        } else {
            console.log('Error:', response.status, response.statusText);
            const text = await response.text();
            console.log('Body:', text);
        }
    } catch (e) {
        console.error('MV Fetch Error:', e);
    }
}

main();
