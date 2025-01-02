import { NextRequest, NextResponse } from 'next/server';
import connectDB from "../../../../lib/db";
import User from "../../../models/user"; // Import your User model

// The handler for the API request
export async function POST(req) {
  try {
    // Parse the incoming request body
    const { userId, links } = await req.json();

    // Validate the input
    if (!userId || !Array.isArray(links)) {
      return new NextResponse(
        JSON.stringify({ error: 'User ID and links are required and links must be an array' }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Find the user by their ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Update the user's links
    user.links = links; // Set the new links
    await user.save(); // Save the updated user

    // Return a success response
    return new NextResponse(
      JSON.stringify({ success: true, message: 'Links updated successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating links:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
