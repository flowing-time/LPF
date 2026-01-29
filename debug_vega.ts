
import fs from 'fs';

async function main() {
    const resourceId = '3087456';
    const url = `https://na5.iiivega.com/api/gates-edge/gates/resource-count?bibIds=${resourceId}`;
    console.log('Fetching:', url);

    try {
        const res = await fetch(url, {
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'Referer': 'https://librarycatalog.mountainview.gov/',
                'Referrer-Policy': 'no-referrer-when-downgrade',
                'Origin': 'https://librarycatalog.mountainview.gov',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        console.log('Status:', res.status);
        if (res.ok) {
            const data = await res.json();
            console.log('Keys:', Object.keys(data));
            // Log structure
            // Usually data.formatGroup.items?
            if (data.formatGroup) {
                console.log('FormatGroup Keys:', Object.keys(data.formatGroup));
                if (data.formatGroup.materialFormats) {
                    console.log('Materials:', data.formatGroup.materialFormats);
                }
            }
            // Check for items/availability
            console.log('Full structure sample:', JSON.stringify(data, null, 2).substring(0, 2000));
        } else {
            console.log('Body:', await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}

main();
