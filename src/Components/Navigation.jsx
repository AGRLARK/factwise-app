import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navigation = () => {
    return (
        <>
            <div className='navigation'>
                <Navbar expand="lg" bg="primary" data-bs-theme="dark" sticky="top" >
                    <Navbar.Brand href="#home" style={{ marginLeft: "2rem" }}>FACTWISE SOLUTIONS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link>View </Nav.Link>
                            <Nav.Link>Edit</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </>
    )
}

export default Navigation