import { authService, storageService } from '../../fbase'
import { signOut } from 'firebase/auth'
import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

const Profile = ({ userObj }) => {
  //이미지 관련 상태 추가
  const [attachment, setAttachment] = useState('')

  //useNavigate()사용
  const navigate = useNavigate()

  const onLogOutClick = () => {
    signOut(authService)
    navigate('/')
  }

  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>

      <br/><br/>

      <img src={userObj.photoURL} style={{width:'50px',height:'50px'}} alt='profileImg' />
      <h3>{userObj.displayName}</h3>
      
      <br/>

      <Link to="editProfile" style={{ textDecoration: 'none' }}>
        수정
      </Link>
    </div>
  )
}

export default Profile
