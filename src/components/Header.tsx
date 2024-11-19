"use client";

import { useGlobalContext } from "@/context/AppContext";
import "@/globals.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddNote from "./AddNote";

export default function Header() {
  // Extracting URL Path
  const pathname = usePathname();

  // State to manage the add new note panel - Context API 
  const { addPanelState, setAddPanelState } = useGlobalContext();

  // Function to toggle the add new note panel
  const handleAddNote = () => {
    setAddPanelState((prevState) => !prevState)
  };

  return (
    <header>
      <div className="cy_header">
        <Image
          className="cy_logo"
          src="/cypher-logo-dark.svg"
          alt=""
          height={24}
          width={100}
          draggable="false"
        />
        <nav className="cy_nav">
          <div className="cy_add_button" onClick={handleAddNote}>
            <Image
              src="/cypher-add-dark.svg"
              alt=""
              height={13}
              width={13}
              draggable="false"
            />
            <p>Add Note</p>
          </div>
          {pathname === "/" ? (
            <div className="cy_link_cont">
              <Link className="cy_link" href={"/archive"}>
                Archives
              </Link>
            </div>
          ) : (
            <div className="cy_link_cont">
              <Link className="cy_link" href={"/"}>
                Notes
              </Link>
            </div>
          )}
        </nav>
      </div>
      {addPanelState ? (
        <AddNote />
      ) : null}
    </header>
  );
}
