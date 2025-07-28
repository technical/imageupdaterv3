import { fetchEuroMillionsData, fetchRolloverInfo } from '../../fetchData.js';
import { generateLotteryImage } from '../../cloudinary-update.js';
import { saveLatestDrawImage } from '../../cloudinary-save.js';

// This function runs every 30 minutes to retry failed scraping attempts
export default async (req) => {
  try {
    // Check if we have a pending retry by looking for a specific environment variable or KV store
    // For now, we'll attempt to scrape and validate the data
    
    // Fetch the lottery data
    const { prizeAmount, drawDate, drawType } = await fetchEuroMillionsData();
    console.log('Retry scraper - found data:', { prizeAmount, drawDate, drawType });
    
    // If we don't have valid data, return early (will retry in 30 minutes)
    if (!prizeAmount || !drawDate) {
      console.log('Retry scraper - data still not available, will retry in 30 minutes');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Data not yet available',
          nextRetry: '30 minutes'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // We have valid data! Process it
    console.log('Retry scraper - valid data found, processing...');
    
    // Check for rollover/super draw info
    const rolloverInfo = await fetchRolloverInfo();
    
    const imageData = {
      prizeAmount,
      drawDate,
      drawType,
      isSuperDraw: rolloverInfo.isTripleRollover || rolloverInfo.rolloverText?.includes('Super')
    };
    
    // Generate the Cloudinary image URL with the latest data
    const imageUrl = await generateLotteryImage(imageData);
    
    // Save the transformed image as a new upload
    const savedImage = await saveLatestDrawImage(imageData);
    
    // Success! The retry worked
    console.log('Retry scraper - successfully processed and saved image');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Retry successful - data scraped and image generated',
        prizeAmount, 
        drawDate, 
        drawType,
        imageUrl,
        savedImageUrl: savedImage.secure_url,
        savedPublicId: savedImage.public_id,
        rolloverInfo 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error in retry function:', err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: String(err),
        message: 'Will retry in 30 minutes'
      }), 
      {
        status: 200, // Return 200 so Netlify doesn't stop retrying
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Run every 30 minutes, but only on Wednesday and Saturday (draw days)
// This covers 00:30, 01:00, 01:30, 02:00, etc. until successful
export const config = {
  schedule: '0,30 * * * 3,6',
};