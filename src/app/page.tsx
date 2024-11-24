"use client";

import Note from "@/components/Note";
import NotFound from "@/components/NotFound";
import { useGlobalContext } from "@/context/AppContext";

export default function CypherUI() {
  // Getting notes from the Context
  const { notes } = useGlobalContext();

  // Checking if there are notes without UserID
  const userNotes = notes.filter((note) => note.userId);

  return (
    <div className="cy_main_cont">
      {/* {notes.map((note) => (
        <Note key={note._id} value={note} />
      ))} */}
      {userNotes.length === 0 ? (
        <NotFound />
      ) : (
        userNotes.map((note) => <Note key={note._id} value={note} />)
      )}
    </div>
  );
}
