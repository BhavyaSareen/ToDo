import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const NewTask = ({ task }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{task?.title}</Card.Title>
              <Card.Text>
                <strong>Description:</strong> {task?.description}
              </Card.Text>
              <Card.Text>
                <strong>Due Date:</strong> {task?.dueDate}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NewTask;
