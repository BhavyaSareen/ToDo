import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SingleTaskModal = ({ show, handleClose, task, isEdit, setIsEdit, title, setTitle, description,setDescription, dueDate, setDueDate, onEdit}) => {
    // const [title, updateTitle] = useState(title);
    // const [desc, updateDesc] = useState(description);
    // const [dueDate, updateDueDate] = useState(dueDate);

    const changeTitile = (e) => {
        // console.log(e.target.value);
        setTitle(e.target.value);
    }

    const changeDesc = (e) => {
        setDescription(e.target.value);
     }

    const changeDate = (e) => {
        setDueDate(e.target.value);
     }

    useEffect(() => {
        // if (task) {
        //     setTitle(task.title);
        //     setDescription(task.description);
        //     setDueDate(task.dueDate);
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
                        <Form.Control type="text" value={title} onChange={changeTitile} />
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={description} onChange={changeDesc} />
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type="text" value={dueDate} onChange={changeDate} />
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
                
                {isEdit? 
                <>
                <Button variant="danger" onClick={handleClose}> Discard Changes </Button>
                <Button variant='success' onClick={onEdit}>Save changes</Button>
                </>
                :
                <>
                <Button variant="secondary" onClick={handleClose}> Close </Button>
                <Button variant="primary" onClick={() => setIsEdit(true)}> Edit </Button>
                </>
                }
            </Modal.Footer>
        </Modal>
    );
};

export default SingleTaskModal;
