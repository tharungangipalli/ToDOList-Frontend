import Image from "next/image";
import TaskForm from "./Components/TaskForm";
import TaskCalendar from "./Components/TaskCalendar";

export default function Home() {
  return (
    <div >
     <TaskForm />
     <TaskCalendar />
    </div>
  );
}
