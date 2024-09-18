import React, { useState } from 'react';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';

const MyTaskListTable = ({ tasks, onEdit, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tasks based on search input
  const filteredTasks = tasks?.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={10}>
          <h2 className="text-center mb-4">My Task List</h2>

          {/* Search Input */}
          <Form.Control
            type="text"
            placeholder="Search by title..."
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks?.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{new Date(task.date).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        variant="primary" 
                        className="me-2" 
                        onClick={() => onView(task)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="warning" 
                        className="me-2" 
                        onClick={() => onEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => onDelete(task)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No tasks available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default MyTaskListTable;
