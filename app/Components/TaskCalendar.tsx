"use client";
import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useTaskStore } from '../store';
import axios from 'axios';
import TaskForm from './TaskForm';

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function TaskCalendar() {
  const { tasks, setTasks } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const startDate = new Date().toISOString(); // start from today
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // adjust as per calendar view
  
      try {
        const response = await axios.get(
          `http://localhost:4000/tasks?start_date=${startDate}&end_date=${endDate.toISOString()}`
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, [setTasks]);

  const handleSelect = ({ start, end }: any) => {
    setSelectedTask({
      title: "",
      description: "",
      start_date: start,
      end_date: end,
      recurring_type: "daily",
      recurring_value: 1,
    });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedTask(event);
    setIsModalOpen(true);
  };

  return (
    <div className="border border-gray-200 shadow-lg p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Tasks Calendar</h2>
      <Calendar
        localizer={localizer}
        events={tasks.map(task => ({
          id: task.id,
          title: task.title,
          start: new Date(task.start_date),
          end: new Date(task.end_date || task.start_date),
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleSelectEvent}
      />
      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTask={selectedTask}
      />
    </div>
  );
}