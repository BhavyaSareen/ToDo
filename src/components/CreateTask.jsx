import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { AuthToken, Base_URL } from '../assets/Utilis';
import { toast } from 'react-toastify';

const CreateTask = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${Base_URL}/tasks`, {
        title, description, dueDate: date }, { headers: { Authorization: `Bearer ${AuthToken()}` } })
      if (res.status === 201) {
        console.log("success");
        toast.success("Task created");
        onTaskCreated();
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Request failed");
      }
      else {
        toast.error("error");
      }
    }
  };

  return (
    <Card>
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="text-center mb-4">Create New Task</h2>
            <Form onSubmit={handleSubmit}>
              {/* Task Name */}
              <Form.Group controlId="formTaskName" className="mb-3">
                <Form.Label>Task Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Description */}
              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Date */}
              <Form.Group controlId="formDate" className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Submit Button */}
              <Button variant="primary" type="submit" className="w-100">
                Create Task
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Card>
  );
};

export default CreateTask;
