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
    // Validate required data
    if (!data.prizeAmount || !data.drawDate) {
      throw new Error(`Missing required data: prizeAmount=${data.prizeAmount}, drawDate=${data.drawDate}`);
    }
    
    // Format the prize amount (assuming it's in millions)
    const prizeFormatted = `£${data.prizeAmount}M`;
    
    // Format the draw date - if it's just a day name, add the actual date
    let drawDateFormatted = data.drawDate;
    
    // For day names, calculate the next occurrence of that day
    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(data.drawDate)) {
      const today = new Date();
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDay = daysOfWeek.indexOf(data.drawDate);
      const currentDay = today.getDay();
      
      let daysUntilTarget = targetDay - currentDay;
      // If it's the same day (tonight's draw), use today
      // If it's in the past this week, add 7 to get next week
      if (daysUntilTarget < 0) daysUntilTarget += 7;
      
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysUntilTarget);
      
      // Format as "Tuesday 19th August"
      const day = targetDate.getDate();
      const month = targetDate.toLocaleDateString('en-GB', { month: 'long' });
      const ordinal = day + (day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th');
      
      drawDateFormatted = `${data.drawDate} ${ordinal} ${month}`;
    }
    
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

    // Generate the full URL by building it manually to preserve commas
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
    const transformationString = transformations.join('/');
    // Add format conversion to PNG
    const imageUrl = `${baseUrl}/${transformationString}/f_png/Euro_template_ypcy4d`;

    console.log('Generated image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}