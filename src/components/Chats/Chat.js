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

const Chat = ({ userObj }) => {
  const { id } = useParams() //각 대화방의 document를 가져옴

  //보낸 사람의 정보만 넣어두고, userObj기반으로 자기 자신일때만 오른쪽배치 할 예정
  const [dialog, setDialog] = useState({
    context: '',
    senderName: userObj.displayName,
    senderId: userObj.uid,
  })
  //이 단위로 firestore의 dialog에 추가가 됨

  const [currentChat, setCurrentChat] = useState([])
  //기존의 대화들을 가져옴, 단위는 dialog와 동일

  const [chat, setChat] = useState([])
  //onsnapshot을 통해 방금 실시간으로 업데이트 된 대화내용을 포함해서
  //document에 있는 dialog부분을 죄다 가져옴
  //최종적으로 이걸 통해 JSX로 화면에 대화 내용이 보여짐

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
        //이거 내가 prev를 왜 썼지? 그냥 context만 바꿔도 될 것 같은데..
        ...prev,
        context: value,
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
    })
  }

  const navigate = useNavigate()

  const onDeleteClick = async () => {
    const ok = window.confirm('대화를 나가면 대화의 모든 기록이 사라집니다.')

    if (ok) {
      //navigate를 먼저하고 삭제해야 한다
      //deleteDoc를 먼저하면 그 순간 navigate가 실행되기도 전에 바로 참조오류를 뱉는다
      navigate('/chatList', { replace: true })
      await deleteDoc(doc(dbService, 'chatTest', `${id}`))
    }
  }

  const goBack=()=>{
    navigate('/chatList', { replace: true })
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="dialog" onChange={onChange} value={dialog.context}></input>
        {dialog.context.length === 0 ? (
          <input type="submit" value="보내기" disabled />
        ) : (
          <input type="submit" value="보내기" />
        )}
      </form>

      <ul>
        {chat.dialog
          ? chat.dialog.map((i, index) => {
              return <li key={index}>{i.context}</li>
            })
          : 'wait..'}
      </ul>
      <button onClick={onDeleteClick}>대화 나가기</button>
      <button onClick={goBack}>뒤로 가기</button>
    </div>
  )
}

export default Chat
