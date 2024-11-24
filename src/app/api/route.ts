import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { MongoClient, Db, Document, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/route";

// GET Request Handler
// Gets all the notes from the database
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // connect to the database
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("cypher-notes");

    const notes: Document[] = await db
      .collection("notes")
      .find({ userId })
      .toArray();

    console.log("Fetched notes: ", notes);

    // return the notes as a response
    return NextResponse.json(notes);
  } catch (error) {
    console.error("error fetching notes:", error);
    return NextResponse.json(
      { error: "failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST Request Handler
// Adds a new note to the database

declare module "next-auth" {
  interface User {
    id: string;
  }

  interface Session {
    user: User;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();
    const userId = session.user.id;

    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 }
      );
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db("cypher-notes");

    const time = new Date();

    const result = await db.collection("notes").insertOne({
      userId,
      title,
      content,
      createdAt: time,
      min: time.getMinutes(),
      hours: time.getHours(),
      day: time.getDate(),
      month: time.getMonth(),
      year: time.getFullYear(),
    });

    const newNote = await db
      .collection("notes")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.log("Failed to create the note", error);

    return NextResponse.json(
      { error: "Failed to create the Note, please try again later..." },
      { status: 500 }
    );
  }
}

// PUT Request Handler
// Edits a note from the database
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, title, content } = body;

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "ID, Title, and Content are required" },
        { status: 400 }
      );
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db("cypher-notes");

    const result = await db
      .collection("notes")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, content, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Note has been updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update the note:", error);
    return NextResponse.json(
      { error: "Failed to update the note, please try again later..." },
      { status: 500 }
    );
  }
}
