// src/components/SignUp.jsx

import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Base_URL } from '../assets/Utilis';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {
  const[name, setName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");
    const[success, setSuccess] = useState(false);
    const navigate = useNavigate();


    const handleSignUp = async(e)=>{
        e.preventDefault();
        // console.log(name)
        // console.log(email)
        // console.log(password)
        try {
          const res = await axios.post(`${Base_URL}/signup`,{
            name, email, password,
          });
          if(res.status === 200){
            // console.log("Successful");
            const token = res.data.token;
            // console.log(token);
            const decodedToken = jwtDecode(token);
            // console.log(decodedToken);
            localStorage.setItem("user",JSON.stringify(decodedToken.claims));
            localStorage.setItem("token",JSON.stringify(token));
            toast.success("Login Successfully")
            navigate('/dashboard')
          }
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.message || "Request failed");
          }
          else{
            toast.error("Error")
          }
        }
    }
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form onSubmit={handleSignUp}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
            <Link to="/login" className='text-center'>Aleady exist? Login</Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;

