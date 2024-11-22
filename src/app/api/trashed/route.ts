import clientPromise from "@/lib/db";
import { MongoClient, Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// GET Request Handler
// Gets the notes from the trash collection
export async function GET() {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("cypher-notes");

    const trashedNote = await db.collection("trash").find({}).toArray();

    return NextResponse.json(trashedNote);
  } catch (error) {
    console.error("error fetching trashed notes:", error);
    return NextResponse.json(
      { error: "failed to fetch trashed notes" },
      { status: 500 }
    );
  }
}

// PATCH Request Handler
// Moves the note to the trash bin and adds a delete datestamp
export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db("cypher-notes");

    const note = await db
      .collection("notes")
      .findOne({ _id: new ObjectId(id) });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const trashedNote = { ...note, deletedAt: new Date() };
    await db.collection("trash").insertOne(trashedNote);

    await db.collection("notes").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      {
        message:
          "Note moved to trash, it will be permanently deleted in 30 days.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to move the note to trash:", error);
    return NextResponse.json(
      { error: "Failed to move the note to trash, please try again later..." },
      { status: 500 }
    );
  }
}

// DELETE Request Handler
// Deletes the note from the database
export async function DELETE() {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("cypher-notes");

    const result = await db.collection("trash").deleteMany();

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Note not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete the note:", error);
    return NextResponse.json(
      { error: "Failed to delete the note, please try again later..." },
      { status: 500 }
    );
  }
}
