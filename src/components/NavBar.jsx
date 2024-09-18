import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {

  const navigate = useNavigate();

  const isLogin = localStorage.getItem("login");
  console.log(isLogin);

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">ToDo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
            <Nav.Link as={Link} to="/tasklist">Task list</Nav.Link>
            {/* Add more links here if needed */}
          </Nav>
          {!isLogin ? (<>
            <Button as={Link} to="/login" variant="outline-primary" className="me-2">
              Login
            </Button>
            <Button as={Link} to="/signup" variant="primary">
              Sign Up
            </Button>
          </>) : (<>
            <NavDropdown
              title={<img src="https://via.placeholder.com/40" alt="Profile" className="rounded-circle" width="40" />}
              id="profile-dropdown"
              align="end">
              <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogOut}>Log Out</NavDropdown.Item>
            </NavDropdown>
          </>)}


        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
