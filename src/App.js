import React, { useEffect, useState } from 'react'
import { Router } from 'react-router-dom'
import AppRouter from './AppRouter'
import Auth from './Auth'
import firebase from './fbase'
import { authService } from './fbase'
import { onAuthStateChanged } from 'firebase/auth'

//�����α��� ���� ��й�ȣ 123456789

function App() {

  const [isLoggedIn,setIsLoggedIn]=useState(authService.currentUser)

  const [init, setInit] = useState(false) 
  //Firebase�� �� �ε� �� ������ 
  //��ٸ��� �ϱ� ���� ���°�

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
