<<<<<<< Updated upstream
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
=======
import React from 'react';
import { Table, Card, Container, Row, Col } from 'react-bootstrap';

const RecentlyAdded = ({ tasks }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Recently Added Task List</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks?.slice(0,4).map(task => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
>>>>>>> Stashed changes
  );
};

export default RecentlyAdded;
