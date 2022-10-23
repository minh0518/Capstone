import { authService, dbService, storageService } from '../../fbase'
import { signOut } from 'firebase/auth'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { getDocs, addDoc, collection } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

const Profile = ({ userObj }) => {
  const [editBirthMode, setEditBirthMode] = useState(false)
  const [editPreferredGenreMode, setEditPreferredGenreMode] = useState(false)
  const [editDisplayNameMode, setEditDisplayNameMode] = useState(false)
  const [editBestPickMode, setEditBestPickMode] = useState(false)

  const [profile, setProfile] = useState({
    displayName: '',
    uid: '',
    birth: '',
    preferredGenre: [],
    bestPick: [],
    photoURL: '',
  })

  const [birthValue, setBirthValue] = useState('')
  const [preferredGenreValue, setPreferredGenreValue] = useState('')
  const [displayNameValue, setDisplayNameValue] = useState('')
  const [bestPickValue, setBestPickValue] = useState('')

  useEffect(() => {
    const getProfiles = async () => {
      const profiles = await getDocs(collection(dbService, 'profiles'))

      profiles.forEach((i) => {
        if (i.data().uid === userObj.uid) {
          setProfile(i.data())
        }
      })
    }

    getProfiles()
  }, [])

  console.log(profile)

  //useNavigate()사용
  const navigate = useNavigate()

  const onLogOutClick = () => {
    signOut(authService)
    navigate('/')
  }

  const onClick = (e) => {
    let { name, value } = e.target

    if (name === 'displayName') {
      setEditDisplayNameMode(true)
    }
    if (name === 'birth') {
      setEditBirthMode(true)
    }
    if (name === 'preferredGenre') {
      setEditPreferredGenreMode(true)
    }
    if (name === 'bestPick') {
      setEditBestPickMode(true)
    }
  }

  const onChange = (e) => {
    let { name, value } = e.target

    if (name === 'displayName') {
      setDisplayNameValue(value)
    }
    if (name === 'birth') {
      setBirthValue(value)
    }
    if (name === 'preferredGenre') {
      setPreferredGenreValue(value)
    }
    if (name === 'bestPick') {
      setBestPickValue(value)
    }
  }

  const onSubmit = async (e) => {

    let { name, value } = e.target

  console.log(name)
  }

  return (
    <div>
      <div>
        닉네임 : {profile.displayName}
        <button name="displayName" onClick={onClick}>
          수정
        </button>
        {editDisplayNameMode ? (
          <form onSubmit={onSubmit}>
            <input
              name="displayName"
              onChange={onChange}
              value={displayNameValue}
            />
            <input type="submit" value="수정하기" />
          </form>
        ) : (
          ''
        )}
      </div>

      <div>
        생년월일 : {profile.birth}
        <button name="birth" onClick={onClick}>
          수정
        </button>
        {editBirthMode ? (
          <form name='birth' onSubmit={onSubmit}>
            <input name="birth" onChange={onChange} value={birthValue} />
            <input type="submit" value="수정하기" />
          </form>
        ) : (
          ''
        )}
      </div>

      <div>
        관심 장르 : {profile.preferredGenre}
        <button name="preferredGenre" onClick={onClick}>
          수정
        </button>
        {editPreferredGenreMode ? (
          <form onSubmit={onSubmit}>
            <input
              name="preferredGenre"
              onChange={onChange}
              value={preferredGenreValue}
            />
            <input type="submit" value="수정하기" />
          </form>
        ) : (
          ''
        )}
      </div>

      <div>
        Best Pick! {profile.bestPick}
        <button name="bestPick" onClick={onClick}>
          수정
        </button>
        {editBestPickMode ? (
          <form onSubmit={onSubmit}>
            <input name="bestPick" onChange={onChange} value={bestPickValue} />
            <input type="submit" value="추가하기" />
          </form>
        ) : (
          ''
        )}
      </div>

      <br />
      <br />

      <img
        src={userObj.photoURL}
        style={{ width: '50px', height: '50px' }}
        alt="profileImg"
      />
      <h3>{userObj.displayName}</h3>

      <br />

      <Link to="editProfileImg" style={{ textDecoration: 'none' }}>
        프로필 이미지 수정
      </Link>

      <br />
      <br />

      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  )
}

export default Profile
