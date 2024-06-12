import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTasks } from '../services/api';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getAllTasks();
        if (Array.isArray(tasks)) {
          setTasks(tasks);
        } else {
          console.error('Expected an array of tasks but got:', tasks);
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks', error.response || error.message || error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <button onClick={() => navigate('/task/new')}>Create New Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.name}</span>
            <button onClick={() => navigate(`/task/${task.id}`)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
