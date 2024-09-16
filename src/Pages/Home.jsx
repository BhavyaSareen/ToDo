import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

function Home() {
    return (
        <div className='container-fluid '>
            <div className='row vh-100'>
                <div className='bg-secondary col-6'>Left</div>
                <div className='col-6'><Outlet/></div>
            </div>
        </div>
        // <Container fluid>
        //     <Row>
        //         <Col md={6} className='bg-secondary'>wert</Col>
        //         <Col md={6} className='bg-primary'>wert</Col>
        //     </Row>
        // </Container>
    )
}

export default Home
