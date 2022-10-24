import { authService, dbService, storageService } from '../../fbase'
import { signOut, updateProfile } from 'firebase/auth'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDocs, addDoc, collection, updateDoc } from 'firebase/firestore'
import Recommand from './Recommand'

const Profile = ({ userObj }) => {
  const [editMode, setEditMode] = useState(false)

  const [profile, setProfile] = useState({
    displayName: '',
    uid: '',
    birth: '',
    preferredGenre: '',
    bestPick: [],
    photoURL: '',
  })

  const genre = {
    ALL: '',
    드라마: 1,
    판타지: 2,
    서부: 3,
    공포: 4,
    로맨스: 5,
    모험: 6,
    스릴러: 7,
    느와르: 8,
    컬트: 9,
    다큐멘터리: 10,
    코미디: 11,
    가족: 12,
    미스터리: 13,
    전쟁: 14,
    애니메이션: 15,
    범죄: 16,
    뮤지컬: 17,
    SF: 18,
    액션: 19,
    무협: 20,
  }

  useEffect(() => {
    const getProfiles = async () => {
      const profiles = await getDocs(collection(dbService, 'profiles'))

      profiles.forEach((i) => {
        if (i.data().uid === userObj.uid) {
          setProfile({
            ...i.data(),
            documentId: i.id,
          })
        }
      })
    }

    getProfiles()
  }, [])

  //useNavigate()사용
  const navigate = useNavigate()

  const onLogOutClick = () => {
    signOut(authService)
    navigate('/')
  }

  const onChange = (e) => {
    let { name, value } = e.target

    if (name === 'displayName') {
      setProfile((prev) => ({
        ...prev,
        displayName: value,
      }))
    }
    if (name === 'birth') {
      setProfile((prev) => ({
        ...prev,
        birth: value,
      }))
    }
    if (name === 'preferredGenre') {
      setProfile((prev) => ({
        ...prev,
        preferredGenre: value,
      }))
    }
    if (name === 'bestPick') {
      setProfile((prev) => ({
        ...prev,
        bestPick: value,
      }))
    }
  }

  const onToggleChange = () => {
    setEditMode((prev) => !prev)
  }

  const onClick = async (e) => {
    e.preventDefault()

    const updateResult = doc(dbService, 'profiles', `${profile.documentId}`)
    await updateDoc(updateResult, {
      ...profile,
    })

    //이름은 수정과 동시에 실제 프로필에도 업뎃을 해야 함
    if (authService.currentUser !== profile.displayName) {
      await updateProfile(authService.currentUser, {
        displayName: profile.displayName,
      })
    }

    setEditMode((prev) => !prev)
  }

  return (
    <div>
      <img
        src={userObj.photoURL}
        style={{ width: '50px', height: '50px' }}
        alt="profileImg"
      />

      <Link to="editProfileImg" style={{ textDecoration: 'none' }}>
        프로필 이미지 수정
      </Link>

      <h3>{userObj.displayName}</h3>

      <br />

      <div>
        닉네임 :
        {editMode ? (
          <input
            name="displayName"
            onChange={onChange}
            value={profile.displayName}
          />
        ) : (
          <>{profile.displayName}</>
        )}
      </div>

      <div>
        생년월일 :
        {editMode ? (
          <input name="birth" onChange={onChange} value={profile.birth} />
        ) : (
          <>{profile.birth}</>
        )}
      </div>

      <div>
        관심 장르 :
        {editMode ? (
          <>
            <select
              id="preferredGenre"
              name="preferredGenre"
              onChange={onChange}
              value={profile.preferredGenre}
            >
              <option value="default" disabled>
                장르를 선택하세요
              </option>
              {Object.keys(genre).map((i, index) => {
                return (
                  <option key={index} value={i}>
                    {i}
                  </option>
                )
              })}
            </select>
          </>
        ) : (
          <> {profile.preferredGenre}</>
        )}
      </div>

      <div>
        Best Pick!
        {editMode ? (
          <input name="bestPick" onChange={onChange} value={profile.bestPick} />
        ) : (
          <>{profile.bestPick}</>
        )}
      </div>

      <br />
      <br />

      {editMode ? (
        <button onClick={onClick}>완료</button>
      ) : (
        <button onClick={onToggleChange}>수정하기</button>
      )}

      <br />
      <br />

      <Recommand preferredGenre={profile.preferredGenre} />

      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  )
}

export default Profile
