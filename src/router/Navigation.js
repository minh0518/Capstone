import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  const styleObj = {
    display: 'flex',
    listStyle: 'none',
  }

  return (
    <nav>
      <ul style={styleObj}>
        <li>
          <Link to="/" style={{ textDecoration: 'none' }}>
            Home
          </Link>
        </li>
        &nbsp;&nbsp;&nbsp;
        <li>
          <Link to="/myProfile" style={{ textDecoration: 'none' }}>
            My Profile
          </Link>
        </li>
        &nbsp;&nbsp;&nbsp;
        <li>
          <Link to="/chatList" style={{ textDecoration: 'none' }}>
            테스트용 Chat
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
