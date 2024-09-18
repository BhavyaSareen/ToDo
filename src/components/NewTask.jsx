import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const NewTask = ({ taskName, description, date }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{taskName}</Card.Title>
              <Card.Text>
                <strong>Description:</strong> {description}
              </Card.Text>
              <Card.Text>
                <strong>Due Date:</strong> {new Date(date).toLocaleDateString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NewTask;
