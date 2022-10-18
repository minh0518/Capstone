import React, { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc, 
  getDoc
} from 'firebase/firestore'
import { dbService } from '../../fbase'
import { useParams } from 'react-router-dom'

const Chat = ({ userObj }) => {

  const { id } = useParams() //각 대화방의 document를 가져옴
  

  //하나의 document에 dailog라는 키값에다가 계속 대화 내용을 추가하는게 나을듯?


  //보낸 사람의 정보만 넣어두고, userObj기반으로 자기 자신일때만 오른쪽배치
  const [dialog, setDialog] = useState({
    context: '',
    senderName: userObj.displayName,
    senderId: userObj.uid,
  })
  //이 단위로 firestore의 dialog에 추가가 됨


  const [currentChat,setCurrentChat]=useState([])
  //기존의 대화들을 가져옴, 단위는 dialog와 동일

  const [chat, setChat] = useState([])
  //최종적으로 onsnapshot을 통해 화면에 보여지는 내용들을 담고있음


  //onsnapshot사용
  useEffect(() => {
    const q = query(collection(dbService, 'chatTest'),
    orderBy('createdAt','desc'))

    onSnapshot(doc(dbService,'chatTest',`${id}`),(snapshot)=>{
      const newChat=snapshot.data()

      setChat(newChat)
    })
    
  }, [])

  console.log(chat)



  //현재 대화들을 다 가져옴
  useEffect(()=>{


     const getDialogs=async ()=>{
      const result=await getDoc(doc(dbService,'chatTest',`${id}`))
     // setCurrentChat((prev=>[...prev,result.data().dialog]))
     setCurrentChat(result.data().dialog)
     } 
     getDialogs()
     
  },[chat])

  console.log(currentChat)


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

    // const doc = await addDoc(collection(dbService, 'chatTest'), {
    //   ...dialog,
    //   createdAt: new Date().toLocaleString(),
    // })

    // setDialog({
    //   context: '',
    //   senderName: userObj.displayName,
    //   senderId: userObj.uid,
    // })

    // console.log(dialog)

    //기존대화에 현재 입력한 대화 추가
    const addChat=[...currentChat,dialog]


    const updateResult=doc(dbService,'chatTest',`${id}`)
    await updateDoc(updateResult,{
      dialog:addChat
    })
    //updateDoc를 해주면 onsnapshot이 작동
    //chat을 업뎃
    //chat을 업뎃하면 setCurrentChat이 되어서 현재 대화업뎃
    //그러면 내가 뭘 입력하게 되면 currentChat기반으로해서
    //firestore의 dialog에 추가
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
        
          {chat.dialog?(chat.dialog).map((i,index)=>{
            return(
              <li key={index}>
                {i.context}
                </li>
            )
          }) :'wait..'}
      </ul>
    </div>
  )
}

export default Chat
