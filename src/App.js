import React, { useEffect, useState } from 'react'
import { Router } from 'react-router-dom'
import AppRouter from './AppRouter'
import Auth from './Auth'
import firebase from './fbase'
import { authService } from './fbase'
import { onAuthStateChanged } from 'firebase/auth'

//깃허브로그인 설정 비밀번호 123456789

function App() {

  const [isLoggedIn,setIsLoggedIn]=useState(authService.currentUser)

  const [init, setInit] = useState(false) 
  //Firebase가 다 로드 될 때까지 
  //기다리게 하기 위한 상태값

  //console.log(authService.currentUser)

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

  return (
    <>
      {init?<AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing...'}
      <footer>&copy; {new Date().getFullYear()} SKU</footer>
    </>
     );
}

export default App;
