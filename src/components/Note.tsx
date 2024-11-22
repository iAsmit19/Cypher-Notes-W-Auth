import Image from "next/image";

export default function Note() {
  return (
    <div className="cy_note">
      <div className="cy_note_cont">
        <div className="note_info">
          <h2>Title here</h2>
          <div className="note_info_div"></div>
          <p>Note&apos;s content here</p>
        </div>
        <div className="cy_note_div"></div>
        <div className="note_status">
          <p>Today | 10:43am</p>
          <Image
            src="/cypher-note-icon-dark.svg"
            alt=""
            height={13}
            width={13}
          />
        </div>
      </div>
    </div>
  );
}
