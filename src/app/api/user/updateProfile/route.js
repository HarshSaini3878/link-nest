import connectDB from "../../../../libs/db";
import User from "../../../models/user";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Parse the request body correctly
        const { userId, profileData } = await req.json(); // Use .json() to get the request body

        // Check if userId and ProfileData are provided
        if (!userId || !profileData || typeof profileData !== 'object') {
            return new NextResponse(
                JSON.stringify({ error: 'User ID and Profile Data are required' }),
                { status: 400 }
            );
        }

        // Log the profile data (optional for debugging)
        console.log("Profile data:", profileData);

        // Destructure ProfileData
        const { username, email, bio, profilePicture, socialMediaHandles } = profileData;

        // Connect to the database
        await connectDB();

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ error: 'User not found' }),
                { status: 404 }
            );
        }

        // Check if the username is being changed and validate uniqueness
        if (username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return new NextResponse(
                    JSON.stringify({ error: 'Username is already taken' }),
                    { status: 400 }
                );
            }
        }

        // Update the user's profile fields, only update if new value is provided
        user.username = username || user.username;
        user.email = email || user.email; // Assuming you also want to update the email
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;
        user.socialMediaHandles = socialMediaHandles || user.socialMediaHandles;

        // Save the updated user
        await user.save();

        // Return success response
        return new NextResponse(
            JSON.stringify({ message: 'Profile updated successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating Profile:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}
