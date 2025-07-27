import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function fetchEuroMillionsData() {
  const response = await fetch('https://www.national-lottery.co.uk/games/euromillions');
  const html = await response.text();
  const $ = cheerio.load(html);

  // Try multiple selectors for jackpot amount
  let prizeAmount = $('.jackpot-amount').first().text().trim() ||
                    $('[data-test="jackpot-amount"]').first().text().trim() ||
                    $('.game-jackpot').first().text().trim() ||
                    $('*:contains("Estimated jackpot")').parent().find('.amount').text().trim();
  
  // Clean up the amount
  prizeAmount = prizeAmount.replace(/[£,]/g, '').replace(/\D+$/, '');
  
  // Try multiple selectors for draw date
  const drawDateText = $('.jackpot-next-draw-date').first().text().trim() ||
                      $('[data-test="next-draw-date"]').first().text().trim() ||
                      $('.next-draw-date').first().text().trim() ||
                      $('*:contains("Next draw")').first().text().trim();
  
  const drawDate = drawDateText.replace(/Next draw:?/i, '').trim();
  
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