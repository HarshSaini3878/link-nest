import connectDB from "../../../../lib/db";
import User from "../../../models/user";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userId, ProfileData } = await req.json();

        // Destructure ProfileData
        const { username, email, bio, profilePicture, socialMediaHandles } = ProfileData;

        // Check if userId and ProfileData are provided
        if (!userId || !ProfileData || typeof ProfileData !== 'object') {
            return new NextResponse(
                JSON.stringify({ error: 'User ID and Profile Data are required' }),
                { status: 400 }
            );
        }

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
        if (username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return new NextResponse(
                    JSON.stringify({ error: 'Username is already taken' }),
                    { status: 400 }
                );
            }
        }
        // Update the user's profile fields
        user.username = username || user.username;
        user.email = email || user.email; // Assuming you also want to update the email
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;
        user.socialMediaHandles =user.socialMediaHandles||socialMediaHandles;

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
