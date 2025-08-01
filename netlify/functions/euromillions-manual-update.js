import { generateLotteryImage } from '../../cloudinary-update.js';
import { saveLatestDrawImage } from '../../cloudinary-save.js';

// This function allows manual updates via Netlify environment variables
// when the scraper is blocked
export default async (req) => {
  try {
    // Get manual values from environment variables
    // Set these in Netlify dashboard when scraper fails
    const prizeAmount = process.env.LOTTERY_PRIZE_AMOUNT || '100';
    const drawDate = process.env.LOTTERY_DRAW_DATE || 'Tuesday';
    const isSuperDraw = process.env.LOTTERY_SUPER_DRAW === 'true';
    
    console.log('Using manual values:', { prizeAmount, drawDate, isSuperDraw });
    
    const imageData = {
      prizeAmount,
      drawDate,
      drawType: 'EuroMillions',
      isSuperDraw
    };
    
    // Generate the Cloudinary image URL with the manual data
    const imageUrl = await generateLotteryImage(imageData);
    
    // Save the transformed image as a new upload
    const savedImage = await saveLatestDrawImage(imageData);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        source: 'manual',
        prizeAmount, 
        drawDate, 
        drawType: 'EuroMillions',
        imageUrl,
        savedImageUrl: savedImage.secure_url,
        savedPublicId: savedImage.public_id,
        isSuperDraw
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error in manual update function:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};