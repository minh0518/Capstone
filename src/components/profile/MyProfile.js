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

  const [bestPickValue, setBestPickValue] = useState('')
  const [bestPickArr, setBestPickArr] = useState('')

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
            bestPick: i.data().bestPick,
            documentId: i.id,
          })

          setBestPickArr(i.data().bestPick)
        }
      })
    }

    getProfiles()
  },[])

  

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
      if(value!==''){
        setBestPickValue(value)
      }
      // setProfile((prev) => ({
      //   ...prev,
      //   bestPick: value,
      // }))

      
    }
  }

  const onToggleChange = () => {
    setEditMode((prev) => !prev)
  }

  console.log([...bestPickArr, bestPickValue])


  const onClick = async (e) => {

    const updateResult = doc(dbService, 'profiles', `${profile.documentId}`)
    
    await updateDoc(updateResult, {
      ...profile,
      bestPick: [...bestPickArr, bestPickValue],
    })

    
    //이름은 수정과 동시에 실제 프로필에도 업뎃을 해야 함
    if (authService.currentUser !== profile.displayName) {
      await updateProfile(authService.currentUser, {
        displayName: profile.displayName,
      })
    }

    console.log([...bestPickArr, bestPickValue])

    //화면에 수정된 값을 바로 보여주기 위해 일부러 추가
    //닉네임,생년월일 이런 것들은 input에 입력하면
    //바로 setProfile의 상태들을 onChange로 바꿔줘서
    //수정을 완료하면 화면에 수정된 값이 그대로 보인다
    //(사실 이건 DB에 저장된 값을 다시 새로 불러와서 보여주는 것이 아니다
    // 그냥 현재 상태값을 보여줄 뿐)
    //근데 bestPick은 아니므로 어쩔 수 없이 편법으로 상태값을 또 한번
    //수정을 해준다 그러면 화면에 수정된 값이 바로 보인다
    setProfile((prev) => ({
      ...prev,
      bestPick: [...bestPickArr, bestPickValue]
    }))
    //고질적인 문제인데 강제로 화면을 리렌더링해서 다시 useEffect를
    //그려내는 방법은 없는건가?
    //그리고 이렇게 하면 또 마지막 값이 자동으로 삭제가 되는 오류가 발생한다

    setBestPickValue('')
    setEditMode((prev) => !prev)
  }


  const onDeleteClick= async e=>{

    let arr=profile.bestPick

    arr=arr.filter(i=>{
      return i!==e.target.value
    })

    console.log(arr)

    const updateResult = doc(dbService, 'profiles', `${profile.documentId}`)
    await updateDoc(updateResult, {
      ...profile,
      bestPick: arr
    })


    setProfile((prev) => ({
      ...prev,
      bestPick: arr
    }))

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
          <>
            <ul>
              {profile.bestPick.map((i) => {
                return <li>{i} <button value={i} onClick={onDeleteClick}>삭제</button></li>
              })}
            </ul>
            <input name="bestPick" onChange={onChange} value={bestPickValue} />
          </>
        ) : (
          <>
            <ul>
              {profile.bestPick.map((i) => {
                return <li>{i}</li>
              })}
            </ul>
          </>
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

      <h4>이 영화는 어떠신가요?</h4>
      <Recommand preferredGenre={profile.preferredGenre} />

      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  )
}

export default Profile
