import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SingleTaskModal = ({ show, onHide, task, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  // Handle form input change when editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  // Save edited task
  const handleSave = () => {
    onEdit(editedTask);
    setIsEditing(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Task' : 'Task Details'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEditing ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={editedTask.date}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        ) : (
          <>
            <h5>{task.title}</h5>
            <p>{task.description}</p>
            <p><strong>Due Date:</strong> {new Date(task.date).toLocaleDateString()}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="warning" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(task)}>
              Delete
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SingleTaskModal;
