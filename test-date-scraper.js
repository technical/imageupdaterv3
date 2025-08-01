import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function testDateScraper() {
  const response = await fetch('https://www.national-lottery.co.uk/games/euromillions');
  const html = await response.text();
  const $ = cheerio.load(html);

  console.log('Testing different selectors for date/time info:\n');

  // Look for countdown/game closes
  const countdownText = $('.game-hero__countdown').text().trim();
  console.log('Countdown text:', countdownText || 'NOT FOUND');

  // Look for "Game closes in" text
  const gameClosesElements = $('*:contains("Game closes")').filter((i, el) => {
    return $(el).children().length === 0; // Only leaf elements
  });
  
  gameClosesElements.each((i, el) => {
    const parent = $(el).parent();
    console.log(`\nGame closes element ${i}:`);
    console.log('Text:', $(el).text().trim());
    console.log('Parent text:', parent.text().trim().substring(0, 200));
  });

  // Look for elements containing days/hours/mins
  const timeElements = $('*:contains("days"), *:contains("hours"), *:contains("mins")').filter((i, el) => {
    const text = $(el).text();
    return text.match(/\d+\s*(days?|hours?|mins?)/);
  }).slice(0, 3);

  console.log('\nTime elements found:');
  timeElements.each((i, el) => {
    console.log(`${i}: "${$(el).text().trim()}"`);
  });

  // Check the current prize amount to ensure we're still getting that correctly
  const prizeText = $('[class*="amount"]').first().text().trim();
  console.log('\nPrize amount:', prizeText);
}

testDateScraper().catch(console.error);