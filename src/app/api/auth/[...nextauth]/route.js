import NextAuth from "next-auth";
import { authOptions } from "../../../../libs/authOptions"; // Import authOptions from the new file

// Next.js 15 API handler
const handler = NextAuth(authOptions);

// Export handler as GET and POST
export { handler as GET, handler as POST };
