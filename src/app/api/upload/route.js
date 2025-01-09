import { NextResponse } from 'next/server';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../../libs/cloudinary'; // Assuming you have cloudinary setup
import nextConnect from 'next-connect';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_images', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

const apiRoute = nextConnect();

apiRoute.use(upload.single('file')); // 'file' is the name of the form field

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for file uploads
  },
};

export async function POST(req) {
  try {
    const { file } = req; // Extract the file uploaded
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const { secure_url, public_id } = file; // Extract the secure URL from Cloudinary

    return NextResponse.json({ url: secure_url, public_id }, { status: 200 }); // Return the URL
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
