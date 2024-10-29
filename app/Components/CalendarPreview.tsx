import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

// Define the event type
interface CalendarEvent {
  id: string;
  title: string;
  start: string; 
  end?: string;
}


interface CalendarPreviewProps {
  events: CalendarEvent[];
  onDateClick: (arg: any) => void;
  onEventClick: (eventId: string) => void;
}

export default function CalendarPreview({ events, onDateClick, onEventClick }: CalendarPreviewProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={onDateClick}
      eventClick={(eventInfo) => onEventClick(eventInfo.event.id)}
      editable={true}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridDay,timeGridWeek,dayGridMonth",
      }}
    />
  );
}
