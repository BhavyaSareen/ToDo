import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthToken, Base_URL } from '../assets/Utilis';
import SingleTaskModal from '../components/SingleTaskModal';

const MyTaskListTable = ({ tasks, onEdit, onView, onDelete }) => {
//   const [searchTerm, setSearchTerm] = useState('');
  const [filterTask, setFilterTask] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const handleEditClick = (task)=>{
    setSelectedTask(task);
    setShowModal(true);
  }
  const handleModalClose = ()=>{
    setSelectedTask(null);
    setShowModal(false);
  }

  useEffect(()=>{
    const fetchTask = async () => {
    try {
      const res = await axios.get(`${Base_URL}/tasks`, { headers: { Authorization: `Bearer ${AuthToken}` } })
      if (res.status === 200) {
        const resData = res.data.tasks;
        const formatTask = Object.keys(resData).map((id)=>({
          id,
          ...resData[id]
        }))
        setFilterTask(formatTask);
        // setTask(formatTask[0]);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Request failed");
      }
      else {
        toast.error("error");
      }
    }
  }
  fetchTask();
  },[])

  // Filter tasks based on search input
//   const filteredTasks = tasks?.filter(task => 
//     task.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={10}>
          <h2 className="text-center mb-4">My Task List</h2>

          {/* Search Input */}
          {/* <Form.Control
            type="text"
            placeholder="Search by title..."
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
    
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
              {filterTask?.length > 0 ? (
                filterTask.map((task, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.dueDate}</td>
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
      <SingleTaskModal show={showModal} hide= {handleModalClose} task={selectedTask} edit = {onEdit} delete ={onDelete}/>
    </Container>
  );
};

export default MyTaskListTable;
