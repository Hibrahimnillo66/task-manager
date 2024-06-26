import React, { useState, useEffect, useContext } from "react";
import { getAllTasks, deleteTask } from "../services/api";
import Navigation from "./Navigation";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import Button from "./Button";
import { format } from "date-fns";
import { FaEdit, FaTrash } from "react-icons/fa";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
          console.error("Expected an array of tasks but got:", tasks);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks", error.response || error.message || error);
        if (error.response && error.response.status === 403) {
          // Clear authentication and redirect to login
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
    };

    fetchTasks();
  }, [setIsAuthenticated]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error.response || error.message || error);
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
      setTasks(tasks.map((task) => (task.id === savedTask.id ? savedTask : task)));
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

  const filteredTasks = tasks.filter((task) => {
    const taskOwner = task.owner ? task.owner.toLowerCase() : '';
    return (
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      taskOwner.includes(searchQuery.toLowerCase()) ||
      task.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex">
      <Navigation />
      <div
        className={`w-5/6 p-12 flex-grow ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <h1 className="text-2xl font-bold mb-6">Active Issues</h1>
        <div className="flex mb-4">
          <Button onClick={handleAddNew} className="mr-4">
            Add New Task
          </Button>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`p-2 border rounded-md flex-grow ${
              theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
            }`}
          />
        </div>
        <div className="mb-2">
          <div
            className={`grid grid-cols-6 gap-4 font-bold p-2 border-b ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            {/* <div>Task ID</div> */}
            <div>Task Name</div>
            <div>Task Category</div>
            <div>Status</div>
            <div>Task Owner</div>
            <div>Date</div>
            <div>Actions</div>
          </div>
          {currentTasks.map((task) => (
            <div
              key={task.id}
              className={`grid grid-cols-6 gap-4 p-2 border-b ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-black"
              }`}
            >
              {/* <div>TID - {task.id.slice(0, 8)}</div> */}
              <div>{task.name}</div>
              <div>{task.category}</div>
              <div>{task.status}</div>
              <div>{task.owner || "N/A"}</div>
              <div>{format(new Date(task.date), "MMM dd yyyy")}</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(task.id)}
                  className="text-gray-600 hover:text-gray-400"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-600 hover:text-gray-400"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
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
