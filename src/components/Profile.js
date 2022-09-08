import { authService } from '../fbase'
import { signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const onLogOutClick = () => {
    signOut(authService)
    navigate('/')
  }

  //useNavigate()»ç¿ë
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  )
}

export default Profile
