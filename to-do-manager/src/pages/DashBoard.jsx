import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../assets/UserContext';

const DashBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(`${BaseUrl}/tasks`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setTasks(data.tasks);
    };

    fetchTasks();
  }, []);

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BaseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, description, dueDate }),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks([newTask, ...tasks]); // Add new task to the list
      setTitle(''); // Reset form
      setDescription('');
      setDueDate('');
    }
  };

  // Handle task click
  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      {/* Left side: Task Creation Form */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Task</h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-600">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 block w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
              Task Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 block w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter task description"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-600">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-2 block w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Task
          </button>
        </form>
      </div>

      {/* Right side: Task Cards */}
      <div className="space-y-8">
        {/* Upper card: Most recent task */}
        {tasks.length > 1 && tasks[0] && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200" onClick={() => handleTaskClick(tasks[0].id)}>
            <div className="bg-gray-50 p-4 rounded-lg cursor-pointer">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{tasks[0].title}</h3>
              <p className="text-gray-600 mb-2">{tasks[0].description}</p>
              <p className="text-sm text-gray-500">
                Due Date: {new Date(tasks[0].dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Lower section: Recent 5 tasks in table */}
        {tasks.length > 1 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <table className="min-w-full bg-gray-50 rounded-lg">
              <thead>
                <tr className="text-left text-sm text-gray-600 font-medium border-b">
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(1, 10).map((task) => (
                  <tr key={task.id} className="border-b text-sm text-gray-800 cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                    <td className="py-2 px-4">{task.title}</td>
                    <td className="py-2 px-4">{task.description}</td>
                    <td className="py-2 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
