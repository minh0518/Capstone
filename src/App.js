import React, { useEffect, useState } from 'react'
import { Router } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import Auth from './components/Auth'
import firebase from './fbase'
import { authService } from './fbase'
import { onAuthStateChanged } from 'firebase/auth'

//깃허브로그인 설정 비밀번호 123456789

function App() {

  const [isLoggedIn,setIsLoggedIn]=useState(authService.currentUser)
  const [init, setInit] = useState(false) 
  //Firebase가 다 로드 될 때까지 
  //기다리게 하기 위한 상태값
  

  //그냥 setState함수 하나만 계속 보내고
  //Home에서 이걸 사용하는거야
  //여기에다가는 info변수로 계속 받아주고

  const[movieInfo,setMovieInfo]=useState([])


  useEffect(()=>{
    onAuthStateChanged(authService,(user)=>{
      if(user){
        setIsLoggedIn(true)
      }
      else{
        setIsLoggedIn(false)
      }
      setInit(true)
    })
  })

  console.log(movieInfo)
  return (
    <>
      {init?<AppRouter isLoggedIn={isLoggedIn} setMovieInfo={setMovieInfo} movieInfo={movieInfo}/> : 'Initializing...'}
      <footer>&copy; {new Date().getFullYear()} SKU</footer>
    </>
     );
}

export default App;
