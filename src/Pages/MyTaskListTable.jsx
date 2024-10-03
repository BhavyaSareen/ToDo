// src/components/TaskListTable.jsx

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthToken, Base_URL } from '../assets/Utilis';
import { toast } from 'react-toastify';
import SingleTaskModal from '../components/SingleTaskModal';

const TaskListTable = () => {
    const [search, setSearch] = useState('');
    const [task, setTask] = useState();
    const [show, setShow] = useState(false);
    const [modalTask, setModalTask] = useState();
    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [date, setDate] = useState();
    const [isEdit, setIsEdit] = useState(false);


    const fetchTask = async () => {
        try {
            const res = await axios.get(`${Base_URL}/tasks`, { headers: { Authorization: `Bearer ${AuthToken()}` } })
            if (res.status == 200) {
                setTask(res.data.tasks)
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

    const onDelete = async (task) => {
        try {
            const res = await axios.delete(`${Base_URL}/tasks/${task.id}`, { headers: { Authorization: `Bearer ${AuthToken()}` } })
            if (res.status === 200) {
                toast.success("Task Deleted");
                fetchTask();
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
    const onEdit = async () => {
        try {
            const res = await axios.patch(`${Base_URL}/tasks/${task.id}`, { headers: { Authorization: `Bearer ${AuthToken()}` } }, {
                title, desc, date
            })
            if (res.status === 200) {
                toast.success("Edited successfully")
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

    const handleShow = (task) => {
        setShow(true);
        setModalTask(task);
    }
    const closeModal = () => {
        setShow(false);
        setIsEdit(false)
    }

    useEffect(() => {
        fetchTask();
    }, [])

    // Filter tasks based on the search input
    const filteredTasks = task?.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mt-5">
            <h3 className="text-center mb-4">Task List</h3>

            {/* Search Bar */}
            <Form.Group controlId="searchBar" className="mb-4">
                <Form.Control
                    type="text" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)}
                />
            </Form.Group>

            {/* Task Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th className='d-flex justify-content-end'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks?.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <tr key={task.id}>
                                <td>{index + 1}</td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.dueDate}</td>
                                <td className='d-flex justify-content-end'>
                                    <Button variant="primary" as={Link} onClick={() => { handleShow(task) }}
                                        className="me-2"> View </Button>
                                    <Button variant="warning" as={Link} onClick={() => onEdit()}
                                        className="me-2" > Edit </Button>
                                    <Button variant="danger" onClick={() => onDelete(task)} >
                                        Delete </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center"> No tasks found </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <SingleTaskModal show={show} handleClose={closeModal} task={modalTask} isEdit = {isEdit} setIsEdit = {setIsEdit} setTitle={setTitle} setDescription={setDesc} setDueDate={setDate} />
        </div>
    );
};

export default TaskListTable;
