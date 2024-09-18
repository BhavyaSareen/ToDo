// src/components/Login.jsx

import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Base_URL } from '../assets/Utilis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../assets/AuthContext';

const Login = () => {

  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const navigate = useNavigate();
  // const {login} = useContext(AuthContext);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    console.log(email);
    try {
      const res = await axios.post(`${Base_URL}/login`,{
        email, password
      })
      console.log(res);
      if(res.status === 200){
        const token = res.data.token;
            // console.log(token);
            const decodedToken = jwtDecode(token);
            // console.log(decodedToken);
            localStorage.setItem("user",JSON.stringify(decodedToken.claims));
            localStorage.setItem("token",JSON.stringify(token));
            localStorage.setItem("login","true");
            // login(token);
            
        toast.success("Login Done");
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message || "Request failed");
      }
      else{
        toast.error("Failed");
      }
    }
  }
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
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
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
