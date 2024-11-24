import clientPromise from "@/lib/db";
import { Db, MongoClient } from "mongodb";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
          return null; // Return null instead of throwing an error to prevent exposing sensitive info
        }

        const { email, password } = credentials;

        const client: MongoClient = await clientPromise;
        const db: Db = client.db("cypher-notes");

        // Check if the user exists
        const existingUser = await db.collection("user").findOne({ email });
        if (!existingUser) {
          return null; // Return null if no user is found (prevents info leakage)
        }

        // Validate the password using bcrypt
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isPasswordValid) {
          return null; // Return null for invalid credentials
        }

        // Return the user object for next-auth session
        return {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
   },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
