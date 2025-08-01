import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function fetchEuroMillionsData() {
  const response = await fetch('https://www.national-lottery.co.uk/games/euromillions');
  const html = await response.text();
  const $ = cheerio.load(html);

  // Find the jackpot amount - it's in an element with class containing "amount"
  let prizeText = $('[class*="amount"]').first().text().trim();
  console.log('Found prize text:', prizeText);
  
  // Extract just the number from "£131MMillion*" format
  let prizeAmount = prizeText.match(/£(\d+)M/i)?.[1] || '';
  
  // Find draw date - look for "tonight", "tomorrow", or day names in the jackpot section
  const jackpotSection = $('[class*="jackpot"]').first().text();
  let drawDate = '';
  
  // Check if it says "tonight" or "tomorrow"
  if (jackpotSection.toLowerCase().includes('tonight')) {
    // Get current day
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    drawDate = days[today.getDay()];
  } else if (jackpotSection.toLowerCase().includes('tomorrow')) {
    // Get tomorrow's day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    drawDate = days[tomorrow.getDay()];
  } else {
    // Extract day from text like "This Tuesday" or just "Tuesday"
    const dayMatch = jackpotSection.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i);
    if (dayMatch) {
      drawDate = dayMatch[1];
    }
  }
  
  const drawType = 'EuroMillions';

  console.log('Debug - Found elements:', {
    prizeAmount: prizeAmount || 'NOT FOUND',
    drawDate: drawDate || 'NOT FOUND',
    drawType
  });

  return { prizeAmount, drawDate, drawType };
}

export async function fetchRolloverInfo() {
  const response = await fetch('https://www.national-lottery.co.uk/games/euromillions');
  const html = await response.text();
  const $ = cheerio.load(html);

  const rolloverText = $('.rollover-info').text().trim();
  const isRollover = rolloverText.toLowerCase().includes('rollover');
  const isDoubleRollover = rolloverText.toLowerCase().includes('double rollover');
  const isTripleRollover = rolloverText.toLowerCase().includes('triple rollover');

  return { 
    isRollover, 
    isDoubleRollover, 
    isTripleRollover,
    rolloverText 
  };
}