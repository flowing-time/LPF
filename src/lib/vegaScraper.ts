import puppeteer from 'puppeteer';
import { Availability } from './types';

const MV_CATALOG_URL = 'https://librarycatalog.mountainview.gov/search/card?id=1b0787a7-4c03-49ee-8787-a74c0349ee3a&entityType=FormatGroup';

export async function fetchMountainViewAvailability(): Promise<Availability | null> {
    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto(MV_CATALOG_URL, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for the availability section to load
        await page.waitForSelector('.availability-status, .format-info, .holdings-info, [class*="availability"]', { timeout: 15000 }).catch(() => null);

        // Give extra time for dynamic content
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Extract availability information from the page
        const availability = await page.evaluate(() => {
            // Look for availability indicators
            const pageText = document.body.innerText;

            // Check for "Available" text
            const hasAvailable = pageText.includes('Available') || pageText.includes('On shelf');

            // Try to find copy count - look for patterns like "90 copies" or "X of Y available"
            const copyMatch = pageText.match(/(\d+)\s*cop(?:y|ies)/i);
            const holdMatch = pageText.match(/(\d+)\s*hold/i);

            let available = 0;
            let total = 0;

            if (copyMatch) {
                total = parseInt(copyMatch[1], 10);
                // If we see "Available" assume at least 1 is available
                available = hasAvailable ? Math.max(1, total) : 0;
            }

            // Also check for explicit available count
            const availMatch = pageText.match(/(\d+)\s*(?:of\s*\d+\s*)?available/i);
            if (availMatch) {
                available = parseInt(availMatch[1], 10);
            }

            return {
                hasAvailable,
                available,
                total,
                debugText: pageText.substring(0, 500) // For debugging
            };
        });

        await browser.close();
        browser = null;

        console.log('[MV Scraper] Result:', availability);

        if (availability.hasAvailable || availability.available > 0) {
            return {
                branchName: 'Mountain View Public Library',
                available: availability.available || 1,
                total: availability.total || 1,
                status: 'Available'
            };
        } else {
            return {
                branchName: 'Mountain View Public Library',
                available: 0,
                total: availability.total || 0,
                status: 'Unavailable'
            };
        }

    } catch (error) {
        console.error('[MV Scraper] Error:', error);
        if (browser) {
            await browser.close();
        }
        // Return null to indicate scraping failed - route.ts will use fallback
        return null;
    }
}
