import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { DateTime } from "luxon";

interface EventProps {
      startTime: string;
      endTime: string;
      onDateSelect: (selectInfo: DateSelectArg) => void;
  }

  // this is for fullCallendar validRange
const getRoundedCurrentTime = (): DateTime => {
  const now = DateTime.local();
  const rounded =
    now.minute < 30
      ? now.set({ minute: 30, second: 0, millisecond: 0 })
      : now.plus({ hours: 1 }).set({ minute: 0, second: 0, millisecond: 0 });

  return rounded; // returns DateTime instance
};

const nowRounded = getRoundedCurrentTime();

const CalendarForEventUpdate : React.FC<EventProps> = ({startTime, endTime, onDateSelect }) => {

    const selectedEvent = {
        id: "",
        title: "", 
        start: new Date(startTime).toISOString(),
        end: new Date(endTime).toISOString(),
        backgroundColor: "#0f766e", 
        borderColor: "#0f766e",   
        textColor: "#ffffff",
      };
    
    return (
        <FullCalendar height={"60vh"}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today,timeGridWeek",
        }}
        events = {[selectedEvent]}
        titleFormat={{ year: 'numeric', month : 'short' }}
        slotDuration="00:30:00"
        timeZone="local" 
        editable={true}
        selectable={true}
        select={(info) => {
            onDateSelect(info); // Pass full selectInfo to handler
          }}
        selectMirror={true}
        dayMaxEvents={true}
        slotMinTime="07:00:00" 
        slotMaxTime="18:00:00" 
        selectAllow={(selectInfo) => {
          const start = DateTime.fromJSDate(selectInfo.start).setZone("Europe/Stockholm");
          // If selected date is today, ensure start time is after rounded time
          if (start.toISODate() === nowRounded.toISODate()) {
            return start >= nowRounded;
          } 
          return true; // allow future dates
        }}
        validRange={{
          start: DateTime.local().toISODate(), // restrict past days
          end: DateTime.local().plus({ months: 4 }).toISODate(),
        }}></FullCalendar>
    );
}

export default CalendarForEventUpdate;

