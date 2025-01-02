import connectDB from "../../../../libs/db";
import User from "../../../models/user";

export async function GET(req) {
  try {
    // Parse the `username` from the query parameters
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    // Validate `username`
    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to the database
    await connectDB();

    // Fetch user data based on the `username`
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the user data
    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
