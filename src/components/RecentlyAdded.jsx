import React from 'react';
import { Table, Card, Container, Row, Col } from 'react-bootstrap';

const RecentlyAdded = ({ tasks }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Some Recently Added Task List</Card.Title>
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
  );
};

export default RecentlyAdded;
