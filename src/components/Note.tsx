import Image from "next/image";

type NoteProps = {
  value: {
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
  };
};

const Note: React.FC<NoteProps> = ({ value }) => {
  // Function to convert the month number value to a string value
  const getMonthName = (monthNumber: string) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[parseInt(monthNumber, 10)];
  };

  // Today's date getter
  const todayDate = new Date();

  return (
    <div className="cy_note">
      <div className="cy_note_cont">
        <div className="note_info">
          <h2>{value.title}</h2>
          <div className="note_info_div"></div>
          <p>{value.content}</p>
        </div>
        <div className="cy_note_div"></div>
        <div className="note_status">
          <p>
            {value.day.toString() === todayDate.getDate().toString() &&
            value.month.toString() === todayDate.getMonth().toString() &&
            value.year.toString() === todayDate.getFullYear().toString()
              ? "Today"
              : `${getMonthName(value.month)}, ${value.day}`}{" "}
            |{" "}
            {`${parseInt(value.hours) < 10 ? `0${value.hours}` : value.hours}:${
              parseInt(value.mins) < 10 ? `0${value.mins}` : value.mins
            }`}
          </p>
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
};

export default Note;
