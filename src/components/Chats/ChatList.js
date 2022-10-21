import React, { useEffect, useState } from 'react'
import {
  addDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { dbService } from '../../fbase'
import { Link } from 'react-router-dom'

const ChatList = ({ userObj }) => {

  //대화신청을 할 상대 유저 이름
  const [name, setName] = useState('')

  //현재 post활동을 한 사람들 이름과 id를 모두 가져오는 상태
  const [allPostUsersInfo, setAllPostUsersInfo] = useState([])

  //useEffect 의존성 배열에서 사용되는 업데이트용 상태
  const [chatTarget, setChatTarget] = useState('')


  //채팅의 documentId와 이름들을 담는 상태
  const [chatInfo, setChatInfo] = useState([])


  //현재 post활동을 한 사람들 이름과 id를 가져옴
  useEffect(() => {
    const getPosts = async () => {
      const dbPosts = await getDocs(collection(dbService, 'posts'))

      let arr = []
      dbPosts.forEach((i) => {
        let obj = {
          name: i.data().userName,
          id: i.data().userId,
        }
        arr.push(obj)
      })

      //중복처리
      arr = arr.filter((item, index) => {
        return (
          arr.findIndex((item2) => {
            return item.name === item2.name
          }) === index
        )
      })

      setAllPostUsersInfo(arr)
    }

    getPosts()
  }, [])

  
  //여기서 chatInfo를 만들어서 아래 JSX에서 대화목록을 보여준다
  //반드시 onSubmit을 해서 chatTarget이 바뀔 경우에만(=새로운 대화가 시작됐을 때) 동작
  useEffect(() => {
    const getPosts = async () => {
      const dbPosts = await getDocs(collection(dbService, 'chatTest'))

      let arr = []
      dbPosts.forEach((i) => {

        //받은사람 보내는사람 구분짓기 어려워서 둘 다 탐색
        if (
          i.data().senderId === userObj.uid ||
          i.data().receiverId === userObj.uid
        ) {
          let obj = {
            documentId: i.id,
            nameList: [i.data().senderName, i.data().receiverName],
            //현재 대화하고 있는 사람 둘 다 추가
            //아래에서 00,00의 대화 이런식으로 보여줄 예정
          }

          arr.push(obj)
        }
      })

      setChatInfo(arr)
    }

    getPosts()
  }, [chatTarget])

  console.log(chatInfo)

  //채팅시작 누르면
  const onSubmit = async (e) => {
    e.preventDefault()

    
    //target은 내가 대화를 건 [{name: , id: }]형태 (filter는 배열반환)
    const target = allPostUsersInfo.filter((i) => {
      return i.name === name
    })

    //대화 상대 이름을 입력하고 버튼을 누르면 firestore에 새로운 문서가 생성
    //2명(나,상대방) 의 이름,uid,대화내용이들어갈 dialog로 구성
    const doc = await addDoc(collection(dbService, 'chatTest'), {
      senderName: userObj.displayName,
      senderId: userObj.uid,
      receiverName: target[0].name,
      receiverId: target[0].id,
      createdAt: new Date().toLocaleString(),
      dialog: '',
    })

    //allPostUsersInfo중에서 대화를 걸 상대방의 {name: , id: }으로 상태 업뎃
    setChatTarget(target[0])
  }

  return (
    <div>
      <div>
        <form onSubmit={onSubmit}>
          <input value={name} onChange={(e) => setName(e.target.value)}></input>
          <input type="submit" value="채팅시작하기"></input>
        </form>
      </div>

        {/* chatTarget으로 대화이름을 보여주면 안될까 싶었는데
        그렇게 되면 onSubmit를 반드시 수행해야 해서 
        반드시 DB에서 가져와서 보여줘야 한다 */}
      {chatInfo.length ? (
        <>
          {chatInfo.map((i, index) => (
            <div key={index}>
              <Link
                style={{ textDecoration: 'none', color: 'black' }}
                to={`/chatList/chat/${i.documentId}`}
              >
                {i.nameList[0]} , {i.nameList[1]} 대화
              </Link>
            </div>
          ))}
        </>
      ) : (
        ''
      )}
    </div>
  )
}

export default ChatList