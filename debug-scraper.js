import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

async function debugScraper() {
  console.log('Fetching EuroMillions page...');
  const response = await fetch('https://www.national-lottery.co.uk/games/euromillions');
  const html = await response.text();
  
  // Save HTML for inspection
  await fs.writeFile('debug-euromillions.html', html);
  console.log('HTML saved to debug-euromillions.html');
  
  const $ = cheerio.load(html);
  
  console.log('\nSearching for jackpot elements...');
  
  // Try to find any element containing jackpot/prize info
  const possibleSelectors = [
    '.jackpot',
    '[class*="jackpot"]',
    '[class*="prize"]',
    '[class*="amount"]',
    '.hero__jackpot',
    '.game-hero__jackpot',
    'h1, h2, h3',
    '[data-test*="jackpot"]',
    '[data-test*="prize"]'
  ];
  
  possibleSelectors.forEach(selector => {
    const elements = $(selector);
    if (elements.length > 0) {
      console.log(`\nFound ${elements.length} elements for selector: ${selector}`);
      elements.each((i, el) => {
        const text = $(el).text().trim();
        if (text && (text.includes('£') || text.includes('Million') || text.includes('jackpot'))) {
          console.log(`  [${i}]: "${text}"`);
        }
      });
    }
  });
  
  // Look for date information
  console.log('\n\nSearching for date elements...');
  const dateSelectors = [
    '[class*="date"]',
    '[class*="draw"]',
    '[data-test*="date"]',
    '[data-test*="draw"]',
    'time'
  ];
  
  dateSelectors.forEach(selector => {
    const elements = $(selector);
    if (elements.length > 0) {
      console.log(`\nFound ${elements.length} elements for selector: ${selector}`);
      elements.slice(0, 3).each((i, el) => {
        const text = $(el).text().trim();
        if (text) {
          console.log(`  [${i}]: "${text}"`);
        }
      });
    }
  });
}

debugScraper().catch(console.error);