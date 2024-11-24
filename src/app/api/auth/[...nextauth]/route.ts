import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { MongoClient, Db } from "mongodb";

// Define the NextAuth options
export const authOptions: NextAuthOptions = {
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
          return null; // Return null if credentials are missing
        }

        const { email, password } = credentials;

        // Use MongoDB client to verify user credentials
        const client: MongoClient = await clientPromise;
        const db: Db = client.db("cypher-notes");

        const user = await db.collection("user").findOne({ email });
        if (!user) return null;

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Use a custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure to set this in .env
};

// Define the handler for GET and POST requests
export const handler = NextAuth(authOptions);

// Export GET and POST handlers separately
export { handler as GET, handler as POST };
