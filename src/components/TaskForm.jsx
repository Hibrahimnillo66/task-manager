// components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { createTask, getTaskById, updateTask } from '../services/api';
import Button from './Button';

const TaskForm = ({ onClose, taskId, onTaskSaved }) => {
  const [task, setTask] = useState({ name: '', description: '', owner: '', category: '', status: '', date: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const taskData = await getTaskById(taskId);
          setTask({
            name: taskData.name,
            description: taskData.description,
            owner: taskData.owner,
            category: taskData.category,
            status: taskData.status,
            date: taskData.date,
          });
        } catch (error) {
          console.error('Error fetching task', error.response || error.message || error);
        }
      };
      fetchTask();
    }
  }, [taskId]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation check
    if (!task.name || !task.description || !task.owner || !task.category || !task.status || !task.date) {
      setError('All fields are required.');
      return;
    }
    setError('');
    try {
      let savedTask;
      if (taskId) {
        savedTask = await updateTask(taskId, task);
      } else {
        savedTask = await createTask(task);
      }
      onTaskSaved(savedTask);
      onClose();
    } catch (error) {
      console.error('Error saving task', error.response || error.message || error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Task Name"
          />
        </div>
        <div>
          <label htmlFor="description" className="sr-only">Description</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Task Description"
          />
        </div>
        <div>
          <label htmlFor="owner" className="sr-only">Owner</label>
          <input
            id="owner"
            type="text"
            name="owner"
            value={task.owner}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Task Owner"
          />
        </div>
        <div>
          <label htmlFor="category" className="sr-only">Category</label>
          <select
            id="category"
            name="category"
            value={task.category}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          >
            <option value="">Select Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="sr-only">Status</label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="date" className="sr-only">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={task.date}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <Button
          type="submit"
          className="w-full"
        >
          {taskId ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
