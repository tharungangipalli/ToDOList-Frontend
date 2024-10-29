"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTaskStore } from "../store";

// Define the Task interface
interface Task {
  id?: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  recurring_type: string;
  recurring_value: number;
}

export default function TaskForm({
  isOpen,
  onClose,
  initialTask,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task;
}) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [startDate, setStartDate] = useState(initialTask?.start_date || "");
  const [endDate, setEndDate] = useState(initialTask?.end_date || "");
  const [recurringType, setRecurringType] = useState(initialTask?.recurring_type || "daily");
  const [recurringValue, setRecurringValue] = useState(initialTask?.recurring_value || 1);

  const { setTasks, addTask, updateTask, deleteTask } = useTaskStore();

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      
      // Validate and set startDate
      if (initialTask.start_date) {
        const startDateObj = new Date(initialTask.start_date);
        if (!isNaN(startDateObj.getTime())) {
          setStartDate(startDateObj.toISOString().slice(0, 16));
        } else {
          setStartDate(""); // Reset to empty if invalid
        }
      }

      // Validate and set endDate
      if (initialTask.end_date) {
        const endDateObj = new Date(initialTask.end_date);
        if (!isNaN(endDateObj.getTime())) {
          setEndDate(endDateObj.toISOString().slice(0, 16));
        } else {
          setEndDate(""); // Reset to empty if invalid
        }
      }

      setRecurringType(initialTask.recurring_type);
      setRecurringValue(initialTask.recurring_value);
    }
  }, [initialTask]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTask: Task = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      recurring_type: recurringType,
      recurring_value: recurringValue,
      id: initialTask?.id,
    };

    try {
      if (initialTask?.id) {
        // Update an existing task
        const response = await axios.put(`http://localhost:4000/tasks/${initialTask.id}`, newTask);
        updateTask(initialTask.id, response.data);
      } else {
        // Create a new task
        const response = await axios.post("http://localhost:4000/tasks", newTask);
        addTask(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async () => {
    if (initialTask?.id) {
      try {
        await axios.delete(`http://localhost:4000/tasks/${initialTask.id}`);
        deleteTask(initialTask.id);
        onClose();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleOverlayClick} // Close on click outside
      ></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-50 bg-white p-6 rounded-md shadow-md w-96"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <h2 className="text-lg font-semibold mb-4">
          {initialTask ? "Edit Task" : "Create Task"}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Recurring Type</label>
          <select
            value={recurringType}
            onChange={(e) => setRecurringType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Recurring Value</label>
          <input
            type="number"
            value={recurringValue}
            onChange={(e) => setRecurringValue(Number(e.target.value))}
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {initialTask ? "Save Changes" : "Create Task"}
          </button>
          {initialTask && (
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete Task
            </button>
          )}
        </div>
      </form>
    </div>
  ) : null;
}