import connectDB from "../../../../libs/db";
import User from "../../../models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const defaultSocialMediaHandles = {
  facebook: '',
  Github: '',
  Linkedin: '',
  Instagram: '',
  Twitter: '',
  Youtube: '',
};

const signUp = async (
  email,
  password,
  username,
  bio = '', // Default bio if not provided
  socialMediaHandles = {} // Default empty object if not provided
) => {
  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username is not available");
  }

  // Hash the password and create the new user
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Merge socialMediaHandles with default values if not provided
  const finalSocialMediaHandles = { ...defaultSocialMediaHandles, ...socialMediaHandles };

  const newUser = new User({
    email,
    username,
    password: hashedPassword, // Store the hashed password
    bio, // Set bio to the passed value or default value
    socialMediaHandles: finalSocialMediaHandles, // Set socialMediaHandles with merged data
  });

  console.log("new user:", newUser);

  try {
    const savedUser = await newUser.save();
    console.log('User saved:', savedUser);
    return savedUser.username;
  } catch (err) {
    console.log('Error saving user:', err);
    throw err; // You can rethrow or handle the error as needed
  }
};





export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          // If username is provided, proceed with signup
          if (credentials?.username) {
            // Signup process
            return await signUp(credentials.email, credentials.password, credentials.username);
          }

          // If no username is provided, proceed with signin (login)
          const user = await User.findOne({
            email: credentials?.email,
          }).select("+password");

          if (!user) {
            throw new Error("Invalid email or password");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!passwordMatch) {
            throw new Error("Invalid email or password");
          }

          return user; // Return user if authenticated
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
        token.username=user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    error: "/error", // Customize the error page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
