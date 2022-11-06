//상단에 고정되는 네비게이션 바 입니다
//여기서 모든 메뉴로 자유자제로 이동할 수 있으며
//채팅기능 또한 여기서 선택함으로써 이동 할 수 있습니다

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService, dbService, storageService } from '../fbase'
import { signOut, updateProfile } from 'firebase/auth'
import { getDocs, addDoc, collection } from 'firebase/firestore'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Button from 'react-bootstrap/Button'

import logoImg from '../logo/MovieAppLogo.png'

const Navigation = ({ userObj }) => {
  const [currentLogin, setCurrentLogin] = useState({
    userImg: '',
    userDisplayName: '',
  })

  useEffect(() => {
    const getProfile = async () => {
      const dbProfiles = await getDocs(collection(dbService, 'profiles'))

      dbProfiles.forEach((i) => {
        console.log(i.data())
        if (i.data().uid === userObj.uid) {
          setCurrentLogin({
            userImg: i.data().photoURL,
            userDisplayName: i.data().displayName,
          })
        }
      })
    }

    getProfile()
  }, [])

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
          <Navbar key={expand} expand={expand} className="mb-3">
            <Container fluid>
              <Navbar.Brand href="#">
                <Link
                  to="/myProfile"
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <img
                    src={currentLogin.userImg}
                    width="40px"
                    height="40px"
                    alt="img"
                    style={{ borderRadius: '50px', marginLeft: '20px' }}
                  />
                  {/* <h5
                    style={{
                      marginTop: '14px',
                      marginLeft: '15px',
                      display: 'inline-block',
                    }}
                  >
                    {currentLogin.userDisplayName}
                  </h5> */}
                </Link>
              </Navbar.Brand>

              {/* 로고가 정 중앙에 있질 않아서 어쩔 수 없이 왼쪽으로30px 이동
              어차피 맨 왼쪽에 있는 프사는 고정너비이고, 이 요소는 프사와 오른쪽 메뉴바를 제외하고
              자동으로 중앙정렬 되므로 px단위로 움직여도 상관없다 */}
              <div style={{marginRight:'30px'}}> 
              <Link
                  to="/"
                  style={{ textDecoration: 'none', color: 'black' }}
                >
               
                  <img src={logoImg} width="240px" height="210px" alt="img" />
                
                </Link>
                </div>
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
                  <img
                    src={currentLogin.userImg}
                    width="50px"
                    height="50px"
                    alt="img"
                    style={{ borderRadius: '50px'}}
                  />
                  <h5
                    style={{
                      marginTop: '14px',
                      marginLeft: '15px',
                      display: 'inline-block',
                    }}
                  >
                    {currentLogin.userDisplayName}
                  </h5>
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="/"><b>Main Menu</b></Nav.Link>
                    <Nav.Link href="/myProfile"><b>My Profile</b></Nav.Link>
                    <Nav.Link href="/chatList"><b>Chat</b></Nav.Link>
                    <Nav.Link href="/movie"><b>Box Office</b></Nav.Link>
                    <Nav.Link href="/social"><b>Social</b></Nav.Link>
                    <Nav.Link onClick={onLogOutClick}><b>Log Out</b></Nav.Link>
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
