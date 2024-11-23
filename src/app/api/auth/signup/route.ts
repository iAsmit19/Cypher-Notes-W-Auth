import clientPromise from "@/lib/db";
import { Db, MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 404 }
    );
  }

  const client: MongoClient = await clientPromise;
  const db: Db = client.db("cypher-notes");

  // Checking if the user already exists
  const existingUser = await db.collection("user").findOne({ email });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  // Create a new user
  const result = await db
    .collection("user")
    .insertOne({ email, password, name });

  return NextResponse.json({
    message: "User has been created",
    userId: result.insertedId,
  });
}
