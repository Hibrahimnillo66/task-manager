// components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { createTask, getTaskById, updateTask } from '../services/api';
import Button from './Button';

const TaskForm = ({ onClose, taskId, onTaskSaved }) => {
  const [task, setTask] = useState({ name: '', description: '', owner: '', date: '', status: '' });

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const taskData = await getTaskById(taskId);
          setTask({ 
            name: taskData.name, 
            description: taskData.description, 
            owner: taskData.owner, 
            date: taskData.date, 
            status: taskData.status 
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
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Task Owner"
          />
        </div>
        <div>
          <label htmlFor="date" className="sr-only">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={task.date}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="status" className="sr-only">Status</label>
          <input
            id="status"
            type="text"
            name="status"
            value={task.status}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Task Status"
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
