// /pages/api/upload.js

import { cloudinary } from "../../../libs/cloudinary"; // Import cloudinary configuration

export async function POST(req, res) {
  try {
    // Get form data from the client
    const formData = await req.formData();
    const file = formData.get("file"); // "file" is the key from FormData

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert the file to Base64 encoding
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // Construct file URI to upload to Cloudinary
    const fileUri = `data:${mimeType};${encoding},${base64Data}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      invalidate: true,
      resource_type: "auto",
      folder: "product-images", // Cloudinary folder name
      filename_override: file.name,
      use_filename: true,
    });

    return res.status(200).json({
      message: "File uploaded successfully",
      imgUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
}
