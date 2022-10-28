import { authService, dbService, storageService } from '../../fbase'
import { signOut, updateProfile } from 'firebase/auth'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDocs, addDoc, collection, updateDoc } from 'firebase/firestore'
import Recommand from './Recommand'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

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
  //bestPick을 추가할때 input창에 작성한 값


  const [bestPickArr, setBestPickArr] = useState('')
  //bestPick을 새로 추가or삭제하기 직전의 값들을 담고 있음

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

    setBestPickArr([...bestPickArr, bestPickValue])
    //bestPickArr은 최초에 db에서 받아오는건 맞는데
    //그 이후에는 db를 다시 엑세스 하지 않으므로 (useEffect는 한번)
    //업뎃을 하면 그 값으로 bestPickArr를 수정해 줘야 한다



    //화면에 수정된 값을 바로 보여주기 위해 일부러 추가
    //닉네임,생년월일 이런 것들은 input에 입력하면
    //바로 setProfile의 상태들을 onChange로 바꿔줘서
    //수정을 완료하면 화면에 수정된 profile상태 값으로써 바로 보인다

    //그러므로 우리가 논리적으로 생각하는
    //"아 화면에 보이는 이정보들은 DB에서 가져온 것이구나" 가 아니다
    // 그냥 현재 상태값을 보여 주는 것이다
    //근데 profile상태 중에서 bestPick속성은 onChange에서 입력하면서 
    //바로 상태를 바꾸지 않으므로 어쩔 수 없이 여기서 편법으로 
    //bestPick부분의 상태값을 또 한번 수정을 해준다
    setProfile((prev) => ({
      ...prev,
      bestPick: [...bestPickArr, bestPickValue]
    }))
    //고질적인 문제인데 강제로 화면을 리렌더링해서 다시 useEffect를
    //그려내는 방법은 없는건가?
    //물론 여기서 useEffect의 의존성 배열을 없애면 되지만
    //그러면 무한 리렌더링이라 이것만은 진짜 하면 안될 것 같다

    

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


    setBestPickArr(arr)
     //bestPickArr은 최초에 db에서 받아오는건 맞는데
    //그 이후에는 db를 다시 엑세스 하지 않으므로 (useEffect는 한번)
    //삭제를 하면 삭제를 하고 난 다음의 DB값으로 
    //bestPickArr를 수정해 줘야 한다

    setEditMode((prev) => !prev)
  }

  return (
    <div>
      {/* <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </Card.Body>
    </Card> */}

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
