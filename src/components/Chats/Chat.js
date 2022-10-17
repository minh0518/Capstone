import React, { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { dbService } from '../../fbase'

const Chat = ({ userObj }) => {
  const [dialog, setDialog] = useState({
    context: '',
    senderName: userObj.displayName,
    senderId: userObj.uid,
  })

  const [chat, setChat] = useState([])

  useEffect(() => {
    const q = query(collection(dbService, 'chatTest'),
    orderBy('createdAt','desc'))

    onSnapshot(q, (snapshot) => {
      const newArray = snapshot.docs.map((i) => ({
        id: i.id, //여기 id는 각 document의 id
        ...i.data(),
      }))

      setChat(newArray)
    })
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target

    if (name === 'dialog') {
      setDialog((prev) => ({
        ...prev,
        context: value,
      }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const doc = await addDoc(collection(dbService, 'chatTest'), {
      ...dialog,
      createdAt: new Date().toLocaleString(),
    })

    setDialog({
      context: '',
      senderName: userObj.displayName,
      senderId: userObj.uid,
    })

    console.log(dialog)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="dialog" onChange={onChange} value={dialog.context}></input>
        {dialog.context.length === 0 ? (
          <input type="submit" value="보내기" disabled/>
        ) : (
          <input type="submit" value="보내기" />
        )}
      </form>

      <ul>
        {chat.map((i, index) => {
          return (
            <div key={index}>
              <li>{i.context}</li>
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default Chat
