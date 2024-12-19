import React, { useEffect, useState } from 'react';
import CreateTask from '../components/CreateTask';
import NewTask from '../components/NewTask';
import RecentlyAdded from '../components/RecentlyAdded';
import { toast } from 'react-toastify';
import { AuthToken, Base_URL } from '../assets/Utilis';
import axios from 'axios';
// import './Dashboard.css';

function Dashboard() {
  // State to store a single selected task
  const [task, setTask] = useState();

  // State to store the list of all tasks
  const [tasks, setTasks] = useState();

  // Fetches tasks from the server and updates state
  const fetchTask = async () => {
    try {
      // Send GET request to retrieve tasks with authorization header
      const res = await axios.get(`${Base_URL}/tasks`, { headers: { Authorization: `Bearer ${AuthToken()}` } });
      
      if (res.status === 200) {
        // If successful, format tasks data and update state
        const resData = res.data.tasks;
        const formatTask = Object.keys(resData).map((id) => ({
          id,
          ...resData[id],
        }));
        setTasks(formatTask);
        setTask(formatTask[0]); // Set the first task as the selected task
      }
    } catch (error) {
      // Error handling for server or network issues
      if (error.response) {
        // Show specific error message from response
        toast.error(error.response.data.message || "Request failed");
      } else {
        // Show a general error message
        toast.error("An error occurred");
      }
    }
  };

  // Fetch tasks when the component is first rendered
  useEffect(() => {
    fetchTask();
  }, []);

  return (
    <div className="dashboard-container container-fluid">
      <div className="row">
        {/* Left section for creating a new task */}
        <div className="col-md-6 p-4 create-task-section">
          <h3 className="section-title text-center">Create New Task</h3>
          {/* Component to create a new task, refetches tasks after a new one is created */}
          <CreateTask onTaskCreated={fetchTask} />
        </div>

        {/* Right section for displaying tasks */}
        <div className="col-md-6 p-4 task-view-section">
          <h3 className="section-title text-center">Current Task</h3>
          {/* Component to display the selected task */}
          <NewTask task={task} />
          
          <h3 className="section-title mt-4 text-center">Recently Added Tasks</h3>
          {/* Component to display the list of recently added tasks */}
          <RecentlyAdded tasks={tasks} />
          {/* Console log for debugging purposes */}
          {console.log(task)}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
