import { fetchEuroMillionsData, fetchRolloverInfo } from '../../fetchData.js';
import { generateLotteryImage } from '../../cloudinary-update.js';

export default async (req) => {
  try {
    // Fetch the lottery data
    const { prizeAmount, drawDate, drawType } = await fetchEuroMillionsData();
    console.log('Scraped data:', { prizeAmount, drawDate, drawType });
    
    // Check for rollover/super draw info
    const rolloverInfo = await fetchRolloverInfo();
    
    // Generate the Cloudinary image URL with the latest data
    const imageUrl = await generateLotteryImage({
      prizeAmount,
      drawDate,
      drawType,
      isSuperDraw: rolloverInfo.isTripleRollover || rolloverInfo.rolloverText?.includes('Super')
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        prizeAmount, 
        drawDate, 
        drawType,
        imageUrl,
        rolloverInfo 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error in scheduled function:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const config = {
  schedule: '30 0 * * 3,6',
};