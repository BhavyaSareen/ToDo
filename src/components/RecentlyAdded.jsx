import React from 'react';
import { Table, Card, Container, Row, Col } from 'react-bootstrap';

const RecentlyAdded = ({ tasks }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Task List</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks?.map((task, index) => (
                    <tr key={index}>
                      <td>{task.title}</td>
                      <td>{new Date(task.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RecentlyAdded;
