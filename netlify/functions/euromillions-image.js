import { fetchEuroMillionsData, fetchRolloverInfo } from '../../fetchData.js';
import { generateLotteryImage } from '../../cloudinary-update.js';
import fetch from 'node-fetch';

export default async (req) => {
  try {
    // Fetch the lottery data
    const { prizeAmount, drawDate, drawType } = await fetchEuroMillionsData();
    
    // Check for rollover/super draw info
    const rolloverInfo = await fetchRolloverInfo();
    
    // Generate the Cloudinary image URL with the latest data
    const imageUrl = await generateLotteryImage({
      prizeAmount,
      drawDate,
      drawType,
      isSuperDraw: rolloverInfo.isTripleRollover || rolloverInfo.rolloverText?.includes('Super')
    });
    
    // Fetch the actual image from Cloudinary
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Return the image directly
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Prize-Amount': prizeAmount,
        'X-Draw-Date': drawDate
      }
    });
  } catch (err) {
    console.error('Error generating image:', err);
    // Return a simple error image or message
    return new Response('Error generating image', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};