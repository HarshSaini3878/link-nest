import { NextResponse } from 'next/server';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../../libs/cloudinary';
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

apiRoute.use(upload.single('file'));

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

    const { path, filename } = file;

    return NextResponse.json({ url: path, public_id: filename }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
