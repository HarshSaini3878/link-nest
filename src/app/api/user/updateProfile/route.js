import connectDB from "../../../../lib/db";
import User from "../../../models/user";
export async function POST(req){
    try {
        
    } catch (error) {
        console.error('Error updating Profile:', error);
            return new NextResponse(
              JSON.stringify({ error: 'Internal Server Error' }),
              { status: 500 }
            );
    }
}