import { useState, useEffect } from 'react';
import { BaseUrl } from '../assets/UserContext';

const Home = () => {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      {tasks.map((task, index) => (
        <div key={index} className="border p-4 mb-2 rounded shadow-sm">
          <h2 className="font-semibold">{task.title}</h2>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
