// src/components/RecentlyAdded.jsx

import React from 'react';

const RecentlyAdded = ({ tasks }) => {
  console.log(tasks)
  return (
    <div>
      <h3>Recently Added Tasks</h3>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks?.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong> 
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default RecentlyAdded;
