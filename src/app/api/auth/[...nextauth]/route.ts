import clientPromise from "@/lib/db";
import { Db, MongoClient } from "mongodb";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        // Validdating the inputs
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password } = credentials;

        const client: MongoClient = await clientPromise;
        const db: Db = client.db("cypher-notes");

        // checking if the user exists
        const existingUser = await db.collection("user").findOne({ email });

        if (existingUser) {
          // Login: check passwords (this must be hashed in apps)
          if (existingUser.password === password) {
            return {
              id: existingUser._id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            };
          } else {
            // Resigner the new user
            const newUser = {
              name: email.split("@")[0],
              email,
              password, // Hash this in production
            };

            const result = await db.collection("user").insertOne(newUser);

            return {
              id: result.insertedId.toString(),
              name: newUser.name,
              email: newUser.email,
            };
          }
        }

        const user = { id: "1", name: "asmit", email: "test@cypher.com" };

        if (email === user.email && password === "password") {
          return user;
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
