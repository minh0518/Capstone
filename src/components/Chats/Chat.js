//ChatList 페이지에서 채팅 목록을 보여준다면 
//여기는 각 채팅 목록에 대해서 실시간 처리를 이용한 채팅을 하는 공간입니다

import React, { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore'
import { dbService } from '../../fbase'
import { useParams, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Toast from 'react-bootstrap/Toast'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'


const Chat = ({ userObj }) => {
  const { id } = useParams() //각 대화방의 document를 가져옴

  //보낸 사람의 정보만 넣어두고, userObj기반으로 자기 자신일때만 오른쪽배치 할 예정
  const [dialog, setDialog] = useState({
    context: '',
    senderName: userObj.displayName,
    senderId: userObj.uid,
    senderImg: userObj.photoURL,
    time: '',
  })
  //이 단위로 firestore의 dialog에 추가가 됨

  const [currentChat, setCurrentChat] = useState([])
  //기존의 대화들을 가져옴, 단위는 dialog와 동일

  const [chat, setChat] = useState([])
  //onsnapshot을 통해 방금 실시간으로 업데이트 된 대화내용을 포함해서
  //document에 있는 dialog부분을 죄다 가져옴
  //최종적으로 이걸 통해 JSX로 화면에 대화 내용이 보여짐

  const [show, setShow] = useState(true)

  const makeDate = () => {
    const date = new Date()

    //const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)

    const dateStr = month + '.' + day + ' ' + hours + ':' + minutes

    console.log(dateStr)

    return dateStr
  }

  //useNavigate()사용
  const navigate = useNavigate()

  //onsnapshot사용
  useEffect(() => {
    //이전 실습과는 달리 onsnapshot을 doc단위로 사용

    onSnapshot(doc(dbService, 'chatTest', `${id}`), (snapshot) => {
      const newChat = snapshot.data()
      setChat(newChat)
    })
  }, [])

  console.log(chat)

  //현재 대화들을 다 가져옴
  useEffect(() => {
    const getDialogs = async () => {
      const result = await getDoc(doc(dbService, 'chatTest', `${id}`))
      // setCurrentChat((prev=>[...prev,result.data().dialog]))
      setCurrentChat(result.data().dialog)
    }
    getDialogs()
  }, [chat])

  const onChange = (e) => {
    const { name, value } = e.target

    if (name === 'dialog') {
      //메세지 단위인 dialog상태 업뎃
      setDialog((prev) => ({
        //이거 내가 prev를 왜 썼었지? 그냥 context만 바꿔도 될 것 같은데..
        //아마 혹시 몰라서 그냥 사용한 것 같다
        ...prev,
        context: value,
        time: makeDate(),
      }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const addChat = [...currentChat, dialog]

    const updateResult = doc(dbService, 'chatTest', `${id}`)
    await updateDoc(updateResult, {
      dialog: addChat,
    })

    setDialog({
      context: '',
      senderName: userObj.displayName,
      senderId: userObj.uid,
      senderImg: userObj.photoURL,
      time: '',
    })
  }

  const onDeleteClick = async () => {
    const ok = window.confirm('대화를 나가면 대화의 모든 기록이 사라집니다.')

    if (ok) {
      //navigate를 먼저하고 삭제해야 한다
      //deleteDoc를 먼저하면 그 순간 navigate가 실행되기도 전에 바로 참조오류를 뱉는다
      navigate('/chatList', { replace: true })
      await deleteDoc(doc(dbService, 'chatTest', `${id}`))
    }
  }

  const goBack = () => {
    if (chat === undefined) {
      window.alert('상대방이 대화를 종료했습니다')
    }
    navigate('/chatList', { replace: true })
  }

  return (
    <div>
      {/* onHide속성을 없애서 아예 다른곳을 클릭해도 못 나가게 만들며
      뒤로가기 버튼을 따로 만듦 */}
      <Offcanvas show={show}>
        <Offcanvas.Header>
          <Offcanvas.Title>Chats</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {chat === undefined ? goBack() : ''}
          {/* 이 방법이 맞는지는 모르겠지만(작동은 매우 잘 됨) 
          도중에 상대방이 나가기를 눌러버리면
          다른 한 쪽에서는 에러가 발생하므로 그 쪽에서도 자동으로 뒤로가기 */}

          {chat.dialog
            ? chat.dialog.map((i, index) => {
                let flexDirection
                if (userObj.uid === i.senderId) {
                  flexDirection = 'row-reverse'
                } else {
                  flexDirection = 'row'
                }
                return (
                  <div
                    style={{ display: 'flex', flexDirection: flexDirection }}
                  >
                    <div style={{ width: '250px' }}>

                    {/* 대화내용을 Toast만 사용한 것이 아니라 Tooltip까지 사용한 이유는 
                    대화 시간도 같이 보여주기 위해서이다 */}
                      <OverlayTrigger
                        placement={flexDirection === 'row' ? 'right' : 'left'}
                        overlay={
                          <Tooltip
                            id={`tooltip-${
                              flexDirection === 'row' ? 'right' : 'left'
                            }`}
                          >
                            {i.time}
                          </Tooltip>
                        }
                      >
                        <Toast>
                          <Toast.Header>
                            <img
                              src={i.senderImg}
                              width="40px"
                              height="40px"
                              alt="img"
                              style={{
                                borderRadius: '50px',
                                marginRight: '10px',
                              }}
                            />
                            <strong className="me-auto">{i.senderName}</strong>
                          </Toast.Header>
                          <Toast.Body>
                            {i.context}

                            {/* <div style={{ display:'flex' }}>
                          <div style={{ flex: '1' }}>{i.context}</div>
                          <div>{i.time}</div>
                          </div> */}
                          </Toast.Body>
                        </Toast>
                      </OverlayTrigger>
                    </div>
                  </div>
                )
              })
            : 'wait..'}
          <br />
          <br />
          <form onSubmit={onSubmit}>
            <input
              name="dialog"
              onChange={onChange}
              value={dialog.context}
            ></input>
            {dialog.context.length === 0 ? (
              <input type="submit" value="보내기" disabled />
            ) : (
              <input type="submit" value="보내기" />
            )}
          </form>
          <div style={{ marginTop: '40px' }}>
          <Button variant="secondary" onClick={onDeleteClick} >대화 나가기</Button>{' '}
          <Button variant="secondary" onClick={goBack}>뒤로 가기</Button>
          </div>
        </Offcanvas.Body>
        <Offcanvas.Body></Offcanvas.Body>
      </Offcanvas>

      {/* <ul>
        {chat.dialog
          ? chat.dialog.map((i, index) => {
              return (
                <div key={index}>
                  <img src={i.senderImg} width="50px" height="50px" alt="img" />
                  <li>{i.context}</li>
                </div>
              )
            })
          : 'wait..'}
      </ul>
      <button onClick={onDeleteClick}>대화 나가기</button>
      <button onClick={goBack}>뒤로 가기</button> */}
    </div>
  )
}

export default Chat
