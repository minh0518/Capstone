import React, { useEffect, useState } from 'react'
import {
  addDoc,getDocs,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { dbService } from '../../fbase'
import Chat from './Chat';
import { Link } from 'react-router-dom'

const ChatList = ({userObj}) => {

    
    const [name,setName]=useState('')
    const [userInfo,setUserInfo]=useState([])
    const [chatTarget,setChatTarget]=useState('')
    const [chatList,setChatList]=useState([])

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

    useEffect(()=>{

        let arr=[]

        const getPosts = async () => {
            const dbPosts = await getDocs(collection(dbService, 'chatTest'))
            dbPosts.forEach((i)=>{
                if(i.data().senderId===userObj.uid ||i.data().receiverId===userObj.uid){
                    arr.push(i.id) //현재 로그인 한 계정을 기반으로 대화중인 documentId반환
                }
            })
        }

        getPosts()


        setChatList(arr)
        

    },[chatTarget])
    

    const onSubmit=async e=>{
        e.preventDefault()

        const target=userInfo.filter(i=>{
            return i.name===name
        })

        
        const doc = await addDoc(collection(dbService, 'chatTest'), {
            senderName:userObj.displayName,
            senderId:userObj.uid,
            receiverName:target[0].name,
            receiverId:target[0].id,
            createdAt: new Date().toLocaleString(),
            dialog:''
          })


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
            
            
                {chatList.length?(
                    <>
                    {chatList.map((i,index)=>(
                        <div key={index}>
                       <Link style={{ textDecoration: 'none', color: 'black' }} to={`/chat/${i}`}>Go to</Link> 
                       </div>
                    ))}
                    </>
                ):''}
                
            
        </div>
    )
};

export default ChatList;