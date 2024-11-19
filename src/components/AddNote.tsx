"use client";

import { useGlobalContext } from "@/context/AppContext";
import gsap from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

export default function AddNote() {
  const { setAddPanelState } = useGlobalContext();
  // Function to toggle the add new note panel
  const handleOutsideClickk = () => {
    const timeline = gsap.timeline();

    timeline
      .to(addPanelContRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(addPanelRef.current, {
        opacity: 0,
        height: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          setAddPanelState((prevState) => !prevState);
        },
      });
  };

  // Function to stop event propagation
  const handlePropagation = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  // Creating reference to elements in order to animate
  const addPanelRef = useRef<HTMLDivElement>(null);
  const addPanelContRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const timeline = gsap.timeline();

    timeline
      .to(addPanelRef.current, {
        opacity: 1,
        height: 300,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(addPanelContRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
  }, []);

  return (
    <div className="cy_add_cont" onClick={handleOutsideClickk}>
      <div
        className="cy_add_panel"
        onClick={handlePropagation}
        ref={addPanelRef}
      >
        <div className="cy_panel_container" ref={addPanelContRef}>
          <div className="cy_add_panel_contents">
            <input
              className="cy_inputs cy_add_title"
              type="text"
              placeholder="Title"
              required
            />
            <div className="cy_inputs_div"></div>
            <textarea
              className="cy_inputs cy_add_content"
              placeholder="Write your thoughts..."
              required
            />
          </div>
          <div className="cy_panel_div"></div>
          <div className="cy_add_panel_features">
            <div className="cy_color_feature">
              <Image src="/cypher-color.svg" alt="" height={20} width={20} />
            </div>
            <div className="cy_other_features">
              <div className="cy_archive_feature">
                <Image
                  src="/cypher-archive-dark.svg"
                  alt=""
                  height={20}
                  width={20}
                />
              </div>
              <div className="cy_feature_div"></div>
              <div className="cy_note_save">
                <p>Save</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
