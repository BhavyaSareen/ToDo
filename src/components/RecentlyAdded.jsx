// src/components/RecentlyAdded.jsx

import React, { useState } from 'react';
import SingleTaskModal from './SingleTaskModal';

const RecentlyAdded = ({ tasks, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  return (
    <div>
      <h3>Recently Added Tasks</h3>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <button onClick={() => handleEditClick(task)}>Edit</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available</p>
      )}
      
      {selectedTask && (
        <SingleTaskModal
          show={showModal}
          onHide={handleModalClose}
          task={selectedTask}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default RecentlyAdded;
