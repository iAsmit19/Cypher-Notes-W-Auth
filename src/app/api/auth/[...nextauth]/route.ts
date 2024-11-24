import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import { Db, MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

// Define the NextAuth configuration
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // Return null if credentials are invalid
        }

        const { email, password } = credentials;

        const client: MongoClient = await clientPromise;
        const db: Db = client.db("cypher-notes");

        // Check if the user exists in the database
        const existingUser = await db.collection("user").findOne({ email });
        if (!existingUser) {
          return null; // User not found
        }

        // Validate the password using bcrypt
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isPasswordValid) {
          return null; // Invalid password
        }

        // Return the user object for session handling
        return {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Redirect to custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Default export handler for NextAuth API routes
export default NextAuth(authOptions);
