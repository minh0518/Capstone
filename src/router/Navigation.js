import React from 'react'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

const Navigation = () => {
  const styleObj = {
    display: 'flex',
    listStyle: 'none',
  }

  return (
    <nav>
      <>

        <Navbar bg="$gray-600" expand="lg" >
          <Container>
            <Navbar.Brand href="#home">Menu</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/myProfile">My Profile</Nav.Link>
                <Nav.Link href="/chatList">테스트용 Chat</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>

      
    </nav>
  )
}

export default Navigation
