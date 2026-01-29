import { fetchMountainViewAvailability } from './src/lib/vegaScraper';

async function test() {
    console.log('Testing Mountain View Puppeteer Scraper...');
    const result = await fetchMountainViewAvailability();
    console.log('Result:', result);
}

test();
