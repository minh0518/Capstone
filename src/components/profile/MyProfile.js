//프로필을 수정하는 페이지입니다
//프로필 사진을 바꿀때는 EditProfileImg페이지에서 바꾸게 되고
//그 외 정보(이름,생년월일,BestPick등...)들은 페이지 이동 없이
//여기서 수정을 하게 됩니다


//프로필 정보들을 바꾸게 되면 
//서버에서 사용된 인증 객체의 정보들도 바꿔줌과 동시에
//기존에 프로필 정보가 사용된 모든 영역 
//(ex Social페이지의 개시글들 , 채팅의 프로필 사진, 영화 리뷰 등..)
//의 DB에 접근해서 죄다 새롭게 변경된 프로필 정보로 바꿔줍니다
//그렇게 되면 프로필 정보를 수정했을 때 기존에 작성된 모든 부분의 프로필 정보가 
//자동으로 바뀐 정보로 수정됩니다 



import { authService, dbService, storageService } from '../../fbase'
import { signOut, updateProfile } from 'firebase/auth'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDocs, addDoc, collection, updateDoc } from 'firebase/firestore'
import Recommand from './Recommand'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { ProfileBox } from '../../styles/Container.styled'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ProfileInput, ProfileSelect } from '../../styles/Container.styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import ShowLocation from '../map/ShowLocation'
import '../../styles/profiles.scss'

//프로필 사진이든 닉네임이든 authService.currentUser에 해당하는 사항을 변경하고
//updateProfile해주면
//새로고침안해도 즉각적으로 authService.currentUser는 바뀐다
//그렇지만  userObj는 최소한 새로고침은 해줘야 한다
//바로 즉각적으로 바뀌진 않는다
//그래서 최소한 프로필사진이든 이름이든 수정하고나서 그 페이지에서 새로고침을 해주고
//프로필화면과 , 상단 nav바의 상태가 바뀐 것을 확인하고 넘어가야 한다

const Profile = ({ userObj }) => {
  const [editMode, setEditMode] = useState(false)

  const [profile, setProfile] = useState({
    displayName: '',
    uid: '',
    birth: '',
    preferredGenre: '',
    bestPick: [],
    photoURL: '',
    favoriteTheater: '',
  })

  const [bestPickValue, setBestPickValue] = useState('')
  //bestPick을 추가할때 input창에 작성한 값

  const [bestPickArr, setBestPickArr] = useState('')
  //bestPick을 새로 추가or삭제하기 직전의 값들을 담고 있음

  //대화목록의 닉네임 변경시 사용
  const [changeChatListDisplayName, setChangeChatListDisplayName] = useState([])
  //대화내용의 닉네임 변경시 사용
  const [changeDialogDisplayName, setChangeDialogDisplayName] = useState([])

  const [changeReviewDisplayName, setChangeReviewDisplayName] = useState([])

  const [changePostDisplayName, setChangePostDisplayName] = useState([])

  const genre = {
    ALL: '',
    SF: 18,
    액션: 19,
    드라마: 1,
    판타지: 2,
    코미디: 11,
    가족: 12,
    공포: 4,
    로맨스: 5,
    모험: 6,
    스릴러: 7,
    뮤지컬: 17,
    느와르: 8,
    컬트: 9,
    다큐멘터리: 10,
    미스터리: 13,
    전쟁: 14,
    서부: 3,
    애니메이션: 15,
    범죄: 16,
    무협: 20,
  }

  useEffect(() => {
    const getProfiles = async () => {
      const profiles = await getDocs(collection(dbService, 'profiles'))

      profiles.forEach((i) => {
        if (i.data().uid === userObj.uid) {
          //DB에 저장된 profile상태를 업뎃해주는데
          //bestPick은 따로 실시간으로 추가해야 하므로
          //따로 bestPick 상태를 업데이트 해주고
          //(근데 지금 보니까 이거 왜 하는지 모르겠다 그냥 ...i.data()하면 자동으로
          //되는게 아닌가?)
          //documenetId를 추가해서 업데이트
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
  }, [])

  // //useNavigate()사용
  // const navigate = useNavigate()

  // const onLogOutClick = () => {
  //   signOut(authService)
  //   navigate('/')
  // }

  console.log(authService.currentUser)
  console.log(userObj)

  //1. 닉네임 변경시 대화목록의 닉네임 , 대화내용의 닉네임 수정
  //sender receiver 찾지 말고 그냥 userObj랑 uid가 같은 이름 변경하면 됨
  //uid가 같은것에 따라서 sender이닞 receiver인지만 구분해서
  //userObj의 displayName으로 바꾸면 됨
  useEffect(() => {
    //1-1.대화목록의 닉네임 수정
    const getChatList = async () => {
      let result = []

      const chats = await getDocs(collection(dbService, 'chatTest'))

      chats.forEach((i) => {
        if (i.data().receiverId === userObj.uid) {
          result.push({
            targetDocumentId: i.id,
            receiverName: userObj.displayName,
          })
        } else if (i.data().senderId === userObj.uid) {
          result.push({
            targetDocumentId: i.id,
            senderName: userObj.displayName,
          })
        }
      })

      setChangeChatListDisplayName(result)
    }

    //1-2.대화내용 닉네임 수정
    //이것 또한 EditProfileImg에서 이미지를 바꿀때 했듯이,
    //직접 대화를 다 돌면서 대화를 통째로 가져와서 updateDoc해야한다
    const getDialog = async () => {
      const chats = await getDocs(collection(dbService, 'chatTest'))
      let result = []

      chats.forEach((i) => {
        let modifiedchats = []

        if (
          //대화에 내가 닉네임을 바꾼 계정이 있다면
          i.data().receiverId === userObj.uid ||
          i.data().senderId === userObj.uid
        ) {
          i.data().dialog.map((singledialog) => {
            if (singledialog.senderId === userObj.uid) {
              modifiedchats.push({
                ...singledialog,
                senderName: userObj.displayName,
              })
            } else {
              modifiedchats.push(singledialog)
            }
          })
          //chatList단위로 push
          result.push({
            targetDocumentId: i.id,
            targetDialog: modifiedchats,
          })
        }
      })

      setChangeDialogDisplayName(result)
    }

    getChatList()
    getDialog()
  }, [profile])

  console.log(changeDialogDisplayName)

  //1.changeDisplayName를 바탕으로 대화목록에 대해서 updateDoc 진행
  useEffect(() => {
    const changeChatListName = async () => {
      for (let i = 0; i < changeChatListDisplayName.length; i++) {
        if (changeChatListDisplayName[i].receiverName) {
          await updateDoc(
            doc(
              dbService,
              'chatTest',
              `${changeChatListDisplayName[i].targetDocumentId}`,
            ),
            {
              receiverName: changeChatListDisplayName[i].receiverName,
            },
          )
        } else if (changeChatListDisplayName[i].senderName) {
          await updateDoc(
            doc(
              dbService,
              'chatTest',
              `${changeChatListDisplayName[i].targetDocumentId}`,
            ),
            {
              senderName: changeChatListDisplayName[i].senderName,
            },
          )
        }
      }
    }

    const changeDialogName = async () => {
      for (let i = 0; i < changeDialogDisplayName.length; i++) {
        await updateDoc(
          doc(
            dbService,
            'chatTest',
            `${changeDialogDisplayName[i].targetDocumentId}`,
          ),
          {
            dialog: changeDialogDisplayName[i].targetDialog,
          },
        )
      }
    }

    changeChatListName()
    changeDialogName()
  }, [changeChatListDisplayName, changeDialogDisplayName])

  //2.닉네임 변경 시, 리뷰 닉네임 수정
  useEffect(() => {
    const getReviewList = async () => {
      let result = []

      const reviews = await getDocs(collection(dbService, 'reviews'))

      reviews.forEach((i) => {
        if (i.data().userId === userObj.uid) {
          result.push({
            targetDocumentId: i.id,
          })
        }
      })

      setChangeReviewDisplayName(result)
    }

    getReviewList()
  }, [profile])

  //2.changeReviewDisplayName를 바탕으로 리뷰목록 대해서 updateDoc 진행
  useEffect(() => {
    const changeReviewsDisplayName = async () => {
      for (let i = 0; i < changeReviewDisplayName.length; i++) {
        await updateDoc(
          doc(
            dbService,
            'reviews',
            `${changeReviewDisplayName[i].targetDocumentId}`,
          ),
          {
            userName: userObj.displayName,
          },
        )
      }
    }

    changeReviewsDisplayName()
  }, [changeReviewDisplayName])

  //changePostDisplayName,setChangePostDisplayName
  //3.닉네임 변경 시, post 닉네임 수정
  useEffect(() => {
    const getPostList = async () => {
      let result = []

      const reviews = await getDocs(collection(dbService, 'posts'))

      reviews.forEach((i) => {
        if (i.data().userId === userObj.uid) {
          result.push({
            targetDocumentId: i.id,
          })
        }
      })

      setChangePostDisplayName(result)
    }

    getPostList()
  }, [profile])

  //3.changePostDisplayName를 바탕으로 updateDoc 진행
  useEffect(() => {
    const changePostsDisplayName = async () => {
      for (let i = 0; i < changePostDisplayName.length; i++) {
        await updateDoc(
          doc(
            dbService,
            'posts',
            `${changePostDisplayName[i].targetDocumentId}`,
          ),
          {
            userName: userObj.displayName,
          },
        )
      }
    }

    changePostsDisplayName()
  }, [changePostDisplayName])

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
      setBestPickValue(value)
      //공백일때 저장되는 것을 막기 위해 여기다가 if (value !== '') 를 걸어버리면
      //텍스트창에 무조건 1글자는 있어야 하므로
      //썼다가 다 지우는게 안됨. 한 글자가 남아 있음

      // setProfile((prev) => ({
      //   ...prev,
      //   bestPick: value,
      // }))
    }

    if (name === 'favoriteTheater') {
      setProfile((prev) => ({
        ...prev,
        favoriteTheater: value,
      }))
    }
  }

  const onToggleChange = () => {
    setEditMode((prev) => !prev)
  }

  const onClick = async (e) => {
    const updateResult = doc(dbService, 'profiles', `${profile.documentId}`)

    //bestPickValue !== '' 를 여러곳에 사용해서 bestPickValue값의 유뮤에 따른 로직을 분리
    //다른건 profile속성을 그대로 사용해서 상관이 없지만 bestPick은 따로 상태로 관리하기 때문에
    //공백인 경우를 분리해야줘야 한다. 안 그러면 빈 값이 계속해서 들어감

    if (bestPickValue !== '') {
      await updateDoc(updateResult, {
        ...profile,
        bestPick: [...bestPickArr, bestPickValue],
      })
    } else {
      await updateDoc(updateResult, {
        ...profile,
      })
    }

    //이름은 수정과 동시에 실제 프로필에도 업뎃을 해야 함
    if (authService.currentUser !== profile.displayName) {
      await updateProfile(authService.currentUser, {
        displayName: profile.displayName,
      })
    }

    if (bestPickValue !== '') {
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
      //(나머지 profile의 속성들은 onChange에서 실시간으로 바꿔줌)
      setProfile((prev) => ({
        ...prev,
        bestPick: [...bestPickArr, bestPickValue],
      }))
      //고질적인 문제인데 강제로 화면을 리렌더링해서 다시 useEffect를
      //그려내는 방법은 없는건가?
      //물론 여기서 useEffect의 의존성 배열을 없애면 되지만
      //그러면 무한 리렌더링이라 이것만은 진짜 하면 안될 것 같다

      setBestPickValue('')
    }

    setEditMode((prev) => !prev)
  }

  const onDeleteClick = async (e) => {
    let arr = profile.bestPick

    arr = arr.filter((i) => {
      return i !== e.target.value
    })

    console.log(arr)

    const updateResult = doc(dbService, 'profiles', `${profile.documentId}`)
    await updateDoc(updateResult, {
      ...profile,
      bestPick: arr,
    })

    setProfile((prev) => ({
      ...prev,
      bestPick: arr,
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
      <h2 className="profilePont">{`${userObj.displayName}'s Profile`}</h2>
      <br />
      <br />
      <Container>
        <Row xs={12} md={12} lg={12}>
          <Col>
            <ProfileBox>
              <div style={{borderRight:'1px solid black' , paddingRight:'50px',marginRight:'50px' }}>
                <img src={userObj.photoURL} style={{width:'330px' ,height:'400px' , borderRadius:'20px'}} alt="" />
              </div>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  {editMode ? (
                    <ProfileInput
                      name="displayName"
                      onChange={onChange}
                      value={profile.displayName}
                    />
                  ) : (
                    <h5><b>{profile.displayName}</b></h5>
                  )}
                  생년월일 :
                  {editMode ? (
                    <ProfileInput
                      name="birth"
                      onChange={onChange}
                      value={profile.birth}
                      placeholder="YYYY.MM.DD"
                    />
                  ) : (
                    <>{profile.birth}</>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  {' '}
                  관심 장르 :
                  {editMode ? (
                    <>
                      <ProfileSelect
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
                      </ProfileSelect>
                    </>
                  ) : (
                    <> {profile.preferredGenre}</>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  {' '}
                  Best Pick!
                  {editMode ? (
                    <>
                      <ul style={{ listStyle: 'none' }}>
                        {profile.bestPick.map((i) => {
                          return (
                            <li>
                              <FontAwesomeIcon
                                icon={faVideo}
                                style={{ paddingRight: '10px' }}
                              />
                              {i}
                              <button
                                value={i}
                                onClick={onDeleteClick}
                                style={{
                                  border: '0',
                                  outline: '0',
                                  background: 'transparent',
                                  color: 'red',
                                }}
                              >
                                X
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      <ProfileInput
                        name="bestPick"
                        onChange={onChange}
                        value={bestPickValue}
                      />
                    </>
                  ) : (
                    <>
                      <ul style={{ listStyle: 'none' }}>
                        {profile.bestPick.map((i) => {
                          return (
                            <li>
                              <FontAwesomeIcon
                                icon={faVideo}
                                style={{ paddingRight: '10px' }}
                              />
                              {i}
                            </li>
                          )
                        })}
                      </ul>
                    </>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  {' '}
                  <b>자주 가는 영화관</b>
                  {editMode ? (
                    <ProfileInput
                      name="favoriteTheater"
                      onChange={onChange}
                      value={profile.favoriteTheater}
                    />
                  ) : (
                    //  profile.favoriteTheater가 있을 경우에만 지도로 보여줌
                    <>
                      {profile.favoriteTheater ? (
                        <>
                          <ShowLocation placeName={profile.favoriteTheater} />
                          <h5>
                            <b>{profile.favoriteTheater}</b>
                          </h5>
                        </>
                      ) : (
                        '아직 선택되지 않았습니다'
                      )}
                    </>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                <Link to="editProfileImg" style={{ textDecoration: 'none' }}>
                  <Button variant="outline-dark">프로필 이미지 수정</Button>
                </Link>
                {editMode ? (
                  <Button variant="outline-dark" onClick={onClick}>
                    완료
                  </Button>
                ) : (
                  <Button variant="outline-dark" onClick={onToggleChange}>
                    수정하기
                  </Button>
                )}
                </ListGroup.Item>
              </ListGroup>
            </ProfileBox>
          </Col>
        </Row>

        <Row xs={12} md={12} lg={12}>
          <Col
            xs={{ span: 12, offset: 1 }}
            md={{ span: 12, offset: 2 }}
            lg={{ span: 12, offset: 4 }}
          >
            <Recommand preferredGenre={profile.preferredGenre} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Profile
