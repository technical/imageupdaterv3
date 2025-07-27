import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function generateLotteryImage(data) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    // Format the prize amount (assuming it's in millions)
    const prizeFormatted = `£${data.prizeAmount}M`;
    
    // Format the draw date
    const drawDateFormatted = data.drawDate;
    
    // Build the transformation URL using your template
    const transformations = [
      // Shadow text layer
      `co_rgb:0000006E,l_text:Montserrat_148_heavy_normal_left_letter_spacing_1:${encodeURIComponent(prizeFormatted)}`,
      'fl_layer_apply,g_center,x_-5',
      // Main prize text layer
      `co_rgb:eecf21,l_text:Montserrat_140_heavy_normal_left_letter_spacing_1:${encodeURIComponent(prizeFormatted)}`,
      'fl_layer_apply,g_center,y_-25',
      // Date text layer
      `co_rgb:FFFFFFD9,l_text:arial_40_normal_left:${encodeURIComponent(drawDateFormatted)}`,
      'fl_layer_apply,g_north,x_54,y_159'
    ];

    // Check if it's a super draw
    if (data.isSuperDraw) {
      transformations.push(
        'co_rgb:F6D100,l_text:helvetica_1_bold_normal_left:*%20*%20S%20U%20P%20E%20R%20D%20R%20A%20W%20*%20*',
        'fl_layer_apply,g_north,y_70'
      );
    }

    // Generate the full URL
    const imageUrl = cloudinary.url('Euro_template_ypcy4d', {
      transformation: transformations.join('/')
    });

    console.log('Generated image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}