// components/TaskList.js
import React, { useState, useEffect } from 'react';
import { getAllTasks, deleteTask } from '../services/api';
import Navigation from './Navigation';
import { useTheme } from '../context/ThemeContext';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Modal from './Modal';
import TaskForm from './TaskForm';
import Button from './Button';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const { theme } = useTheme();
  const { setIsAuthenticated } = useContext(AuthContext);

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
        if (error.response && error.response.status === 403) {
          // Clear authentication and redirect to login
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
    };

    fetchTasks();
  }, [setIsAuthenticated]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task', error.response || error.message || error);
    }
  };

  const handleEdit = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedTaskId(null);
    setIsModalOpen(true);
  };

  const handleTaskSaved = (savedTask) => {
    if (selectedTaskId) {
      setTasks(tasks.map(task => (task.id === savedTask.id ? savedTask : task)));
    } else {
      setTasks([...tasks, savedTask]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex">
      <Navigation />
      <div className={`w-5/6 p-4 flex-grow ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <h1 className="text-2xl font-bold mb-6">Active Issues</h1>
        <div className="flex mb-4">
          <Button onClick={handleAddNew} className="mr-4">Add New Task</Button>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded-md flex-grow"
          />
        </div>
        <div className="mb-2">
          <div className={`grid grid-cols-6 gap-4 font-bold p-2 border-b ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div>Task ID</div>
            <div>Task Name</div>
            <div>Date</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {currentTasks.map((task) => (
            <div key={task.id} className={`grid grid-cols-6 gap-4 p-2 border-b ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'}`}>
              <div>{task.id}</div>
              <div>{task.name}</div>
              <div>{task.date}</div>
              <div>{task.status}</div>
              <div className="flex space-x-2">
                <Button onClick={() => handleEdit(task.id)} className="mr-2">Edit</Button>
                <Button onClick={() => handleDelete(task.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <TaskForm onClose={closeModal} taskId={selectedTaskId} onTaskSaved={handleTaskSaved} />
        </Modal>
      </div>
    </div>
  );
};

export default TaskList;
