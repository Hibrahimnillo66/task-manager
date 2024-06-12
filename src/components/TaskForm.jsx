import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/api';

function TaskForm() {
  const [task, setTask] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(task);
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task', error.response || error.message || error);
    }
  };

  return (
    <div>
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={task.name} onChange={handleChange} />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={task.description} onChange={handleChange}></textarea>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default TaskForm;
