import { fetchEuroMillionsData, fetchRolloverInfo } from './fetchData.js';

console.log('Testing EuroMillions scraper...\n');

try {
  const data = await fetchEuroMillionsData();
  console.log('Prize Data:');
  console.log('- Prize Amount: £' + data.prizeAmount);
  console.log('- Draw Date:', data.drawDate);
  console.log('- Draw Type:', data.drawType);
  
  console.log('\nFetching rollover info...');
  const rolloverInfo = await fetchRolloverInfo();
  console.log('Rollover Info:');
  console.log('- Is Rollover:', rolloverInfo.isRollover);
  console.log('- Is Double Rollover:', rolloverInfo.isDoubleRollover);
  console.log('- Is Triple Rollover:', rolloverInfo.isTripleRollover);
  console.log('- Rollover Text:', rolloverInfo.rolloverText || 'None');
} catch (error) {
  console.error('Error:', error.message);
}