import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService, dbService, storageService } from '../fbase'
import { signOut, updateProfile } from 'firebase/auth'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Offcanvas from 'react-bootstrap/Offcanvas'

const Navigation = () => {
  //useNavigate()사용
  const navigate = useNavigate()
  const onLogOutClick = () => {
    signOut(authService)
    navigate('/')
  }

  return (
    <nav>
      <>
        {[false].map((expand) => (
          <Navbar key={expand} bg="light" expand={expand} className="mb-3">
            <Container fluid>
              <Navbar.Brand href="/">로고자리?</Navbar.Brand>
              <Navbar.Toggle
                aria-controls={`offcanvasNavbar-expand-${expand}`}
              />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    Menu를 선택하세요
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="/">Main Menu</Nav.Link>
                    <Nav.Link href="/myProfile">My Profile</Nav.Link>
                    <Nav.Link href="/chatList">테스트용 Chat</Nav.Link>
                    <Nav.Link href="/movie">Movie</Nav.Link>
                    <Nav.Link href="/social">Social</Nav.Link>
                    <Nav.Link onClick={onLogOutClick}>Log Out</Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        ))}
        {/* <Navbar bg="light" expand="lg">
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
        </Navbar> */}
      </>
    </nav>
  )
}

export default Navigation
