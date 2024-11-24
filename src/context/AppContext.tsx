"use client";

import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  day: string;
  month: string;
  year: string;
  hours: string;
  mins: string;
}

interface GlobaContextType {
  addPanelState: boolean;
  setAddPanelState: React.Dispatch<React.SetStateAction<boolean>>;
  showHeader: boolean;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  fetchNotes: () => Promise<void>;
  addNote: (note: Note) => Promise<void>;
}

const GlobalContext = createContext<GlobaContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // State to manage the header
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(false);

  // State to manage the add new note panel
  const [addPanelState, setAddPanelState] = useState(false);

  // State to fetch the new notes
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (pathname.startsWith("/auth")) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [pathname]);

  // Fetching the Notes from the GET Request Handler
  const fetchNotes = async () => {
    try {
      const response = await fetch("/api");

      if (!response.ok) {
        throw new Error("Failed to fetch the notes");
      }

      const data = await response.json();

      const sortNotes = data.sort((a: Note, b: Note) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);

        return bDate.getTime() - aDate.getTime();
      });

      setNotes(sortNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Adding a new note
  const addNote = async (newNote: { title: string; content: string }) => {
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      const addedNote = await response.json();

      if (response.ok) {
        setNotes((prevNote) => [...prevNote, addedNote]);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  useEffect(() => {
    fetchNotes();

    setInterval(() => {
      fetchNotes();
    }, 60000); // Fetch notes every minute
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        addPanelState,
        setAddPanelState,
        showHeader,
        notes,
        setNotes,
        fetchNotes,
        addNote,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};
