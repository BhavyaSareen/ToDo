import React from "react";
import { Container, Row, Col, Button, Card, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomeContent = () => {
  return (
    <Container className="mt-5">
      {/* Hero Section */}
      <Row className="text-center">
        <Col>
          <h1>Welcome to Our Platform</h1>
          <p className="lead">
            Explore amazing features and enhance your experience with us.
          </p>
          <Button variant="primary" size="lg">
          <Nav.Link as={Link} to="/login">Get Started</Nav.Link>
          </Button>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mt-5">
        <Col md={4} className="d-flex">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Feature One</Card.Title>
              <Card.Text>
                Description of the first feature with amazing benefits.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="d-flex">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Feature Two</Card.Title>
              <Card.Text>
                Explanation of the second feature that users will love.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="d-flex">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Feature Three</Card.Title>
              <Card.Text>
                Details about the third feature with powerful capabilities.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Call to Action Section */}
      <Row className="mt-5 text-center">
        <Col>
          <h2>Join Us Today</h2>
          <p>Sign up now and start experiencing the best services.</p>
          <Button variant="success" size="lg">
          <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeContent;
