import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SingleTaskModal = ({ show, handleClose, task, isEdit, setIsEdit, setTitle, setDescription, setDueDate }) => {
    
    const changeTitile = (e)=>{
        console.log(e.target.value)
    }

    const changeDesc = ()=>{}

    const changeDate = ()=>{}

    useEffect(() => {
        // if (task) {
        //     setTitle(task.title)
        //     setDescription(task.description)
        //     setDueDate(task.dueDate)
        // }
    }, [])
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? "Editing" : "Task Details"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isEdit ? (<Form>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type = "text" onChange={changeTitile}/>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type = "text" onChange={changeDesc}/>
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type = "text" onChange={changeDate}/>
                    </Form.Group>
                </Form>) :
                    (<><h5>Title</h5>
                        <p>{task ? task.title : 'Task Details'}</p>
                        <h5>Description</h5>
                        <p>{task ? task.description : 'No description available.'}</p>
                        <h5>Date</h5>
                        <p>{task ? task.dueDate : 'No date available.'}</p></>)}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => setIsEdit(true)}>
                    Edit
                </Button>
                <Button variant="danger">
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SingleTaskModal;
