import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function saveTransformedImage(imageUrl, publicId = null) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    // Generate a public ID based on current date if not provided
    if (!publicId) {
      const now = new Date();
      publicId = `euromillions/generated/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}-${now.getHours()}${now.getMinutes()}`;
    }

    // Upload the transformed image URL to Cloudinary
    // This will fetch the image from the URL and save it as a new resource
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      folder: 'euromillions/saved',
      tags: ['euromillions', 'generated', 'lottery'],
      context: {
        caption: 'EuroMillions Draw',
        created_at: new Date().toISOString()
      }
    });

    console.log('Saved transformed image:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height
    });

    return result;
  } catch (error) {
    console.error('Error saving transformed image:', error);
    throw error;
  }
}

// Function to save the latest draw image
export async function saveLatestDrawImage(data) {
  try {
    // First generate the transformation URL
    const { generateLotteryImage } = await import('./cloudinary-update.js');
    const transformedUrl = await generateLotteryImage(data);
    
    // Then save it as a new upload with a predictable public_id
    const publicId = `euromillions/latest-draw`;
    const result = await saveTransformedImage(transformedUrl, publicId);
    
    // Also save a dated version for history
    const datePublicId = `euromillions/history/${data.drawDate.toLowerCase().replace(/\s+/g, '-')}-${data.prizeAmount}m`;
    await saveTransformedImage(transformedUrl, datePublicId);
    
    return result;
  } catch (error) {
    console.error('Error in saveLatestDrawImage:', error);
    throw error;
  }
}