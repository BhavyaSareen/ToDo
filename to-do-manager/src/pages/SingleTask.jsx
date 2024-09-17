import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SingleTask = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/tasks/${taskId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setTask(data);
    };

    fetchTask();
  }, [taskId]);

  return (
    <div className="p-4">
      {task ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
          <p>{task.description}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SingleTask;
