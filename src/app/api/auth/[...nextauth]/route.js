import connectDB from "../../../../libs/db";
import User from "../../../models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Default social media handles
const defaultSocialMediaHandles = {
  facebook: '',
  Github: '',
  Linkedin: '',
  Instagram: '',
  Twitter: '',
  Youtube: '',
};

// Sign-up function to create a new user
const signUp = async (
  email,
  password,
  username,
  bio = '', // Default bio if not provided
  socialMediaHandles = {} // Default empty object if not provided
) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username is not available");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const finalSocialMediaHandles = { ...defaultSocialMediaHandles, ...socialMediaHandles };

  const newUser = new User({
    email,
    username,
    password: hashedPassword,
    bio,
    socialMediaHandles: finalSocialMediaHandles,
  });

  console.log("new user:", newUser);

  try {
    const savedUser = await newUser.save();
    console.log('User saved:', savedUser);
    return savedUser;
  } catch (err) {
    console.log('Error saving user:', err);
    throw err;
  }
};

// NextAuth options
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          if (credentials?.username) {
            // Signup process
            return await signUp(
              credentials.email,
              credentials.password,
              credentials.username
            );
          }

          const user = await User.findOne({ email: credentials?.email }).select("+password");
          if (!user) {
            throw new Error("Invalid email or password");
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) {
            throw new Error("Invalid email or password");
          }

          return user; // Return full user object if authenticated
        } catch (error) {
          throw new Error(error.message || "Error during authentication");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && token?.username) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    error: "/error", // Customize the error page
  },
};

// Next.js 15 API handler
const handler = NextAuth(authOptions);

// Export handler as GET and POST
export { handler as GET, handler as POST };
