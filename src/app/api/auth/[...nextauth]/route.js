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
  bio = '',
  socialMediaHandles = {}
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

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    throw err;
  }
};

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

          return user;
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
    error: "/error",
  },
};

export default (req, res) => NextAuth(req, res, authOptions);
