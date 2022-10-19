import React, { useEffect, useState } from 'react'
import {
  addDoc,getDocs,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { dbService } from '../../fbase'
import { Link } from 'react-router-dom'

const ChatList = ({userObj}) => {

    
    const [name,setName]=useState('')

    //현재 post활동을 한 사람들 이름과 id
    const [userInfo,setUserInfo]=useState([])

    const [chatTarget,setChatTarget]=useState('')

    const [chatIdList,setChatIdList]=useState([])
    const [chatNameList,setChatNameList]=useState([])


    //현재 post활동을 한 사람들 이름과 id를 가져옴
    useEffect(()=>{
        const getPosts=async ()=>{
            const dbPosts = await getDocs(collection(dbService, 'posts'))
            
            let arr=[]
            dbPosts.forEach(i=>{
                let obj={
                    name:i.data().userName,
                    id:i.data().userId
                }
                arr.push(obj)
                //setUserId((prev)=>[...prev,obj])
            })
            
            //중복처리
            arr=arr.filter((item,index)=>{
                return(
                  arr.findIndex((item2)=>{
                    return item.name===item2.name
                  })===index
                )
              })
            
              setUserInfo(arr)
        }


        getPosts()
    },[])


    console.log(userInfo)


    //현재 로그인 한 계정을 기준으로 firestore에서 대화중인 documentId반환
    //firstore에는 방금 onsubmit으로 대화도 들어가있다 (의존성배열을 chatTarget으로 넣어줘서)
    //나중에 chatList로 화면에서 현재 진행중인 채팅목록들을 보여주는 것
    useEffect(()=>{

        let idList=[]
        let nameList=[]

        const getPosts = async () => {
            const dbPosts = await getDocs(collection(dbService, 'chatTest'))
            dbPosts.forEach((i)=>{

                //받은사람 보내는사람 구분짓기 어려워서 둘 다 탐색
                if(i.data().senderId===userObj.uid ||i.data().receiverId===userObj.uid){
                    idList.push(i.id) //현재 로그인 한 계정을 기준으로 firestore에서 대화중인 documentId들을 push
                    nameList.push([i.data().senderName,i.data().receiverName]) 
                    ////현재 로그인 한 계정을 기준으로 firestore에서 대화중인 document에 각각 들어있는 이름들을 push 
                    //(아래 채팅 이름으로 사용)
                }
            })
        }

        getPosts()


        setChatIdList(idList)

        setChatNameList(nameList) //수정 필요
        //지금생각해보니 저거 2개 합치는게 나을 것 같다
        //아래에서 어차피 id기반으로 Link로 넘어가는데 거기에 같이 사용하는게 좋을듯

        //잘못하면 id하고 이름하고 따로 놀게 된다
        

    },[chatTarget])

    console.log(chatIdList)
    console.log(chatNameList)
    

    //채팅시작 누르면
    const onSubmit=async e=>{
        e.preventDefault()

        //userInfo(post에 있는 이름들)를 기반으로 내가 입력한 이름을 찾음
        //target은 그러면 내가 대화를 건 [{name: , id: }]형태로 들어와있음(filter는 배열반환)
        const target=userInfo.filter(i=>{
            return i.name===name
        })
        
        console.log(target)


        //이름을 입력하고 버튼을 누르면 firestore에 새로운 문서가 생성
        //2명의 이름,uid , 대화내용이들어갈 dialog로 구성
        const doc = await addDoc(collection(dbService, 'chatTest'), {
            senderName:userObj.displayName,
            senderId:userObj.uid,
            receiverName:target[0].name,
            receiverId:target[0].id,
            createdAt: new Date().toLocaleString(),
            dialog:''
          })


        //userInfo중에서 대화를 할 상대방의 {name: , id: }으로 상태 업뎃
          setChatTarget(target[0])
    
    }

    console.log(userObj)
    console.log(chatTarget)



    return (
        <div>
            <div>
            <form onSubmit={onSubmit}>
                <input value={name} onChange={(e)=>setName(e.target.value)}></input>
                <input type='submit' value='채팅시작하기'></input>
            </form>
            </div>
            
            
                {chatIdList.length?(
                    <>
                    {chatIdList.map((i,index)=>(
                        <div key={index}>
                       <Link style={{ textDecoration: 'none', color: 'black' }} to={`/chat/${i}`}>asdas</Link> 
                       </div>
                    ))}
                    </>
                ):''}
                
            
        </div>
    )
};

export default ChatList;