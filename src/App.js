import React, { useEffect, useState } from 'react'
import { Router } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import Auth from './components/Auth'
import firebase from './fbase'
import { authService } from './fbase'
import { onAuthStateChanged,updateProfile } from 'firebase/auth'

//깃허브로그인 설정 비밀번호 123456789

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser)
  const [init, setInit] = useState(false)
  //Firebase가 다 로드 될 때까지
  //기다리게 하기 위한 상태값

  //그냥 setState함수 하나만 계속 보내고
  //Home에서 이걸 사용하는 것이다
  //여기에다가는 info변수로 계속 받아준다

  const [movieInfo, setMovieInfo] = useState([])

  const [userObj,setUserObj]=useState(null)

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) { //로그인이 된 상태
        setIsLoggedIn(true)


        //이게 지금 필요한지는 모르겠는데 우선 
        //local login으로 하면 displayName이 null이므로 그걸 바꿔줌
        if (user.displayName === null) {
          const name = user.email.split('@')[0]
          //updateProfile 사용
          updateProfile(authService.currentUser, {
            displayName: name,
          })
        }

        setUserObj({
          //앞으로 모든 컴포넌트에서 uid나 displayName으로 유저들을 구분해야 함
          displayName: user.displayName,
          uid: user.uid 
        })
      } else {
        setIsLoggedIn(false)
         setUserObj(null)
      }
      setInit(true)
    })
  },[])

  console.log(userObj)


  //여기선 애초에 개인 프로필 자체가 없으므로
  //프로필 업뎃같은 기능은 뺌

  console.log(movieInfo)
  
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          setMovieInfo={setMovieInfo}
          movieInfo={movieInfo}
          userObj={userObj}
        />
      ) : (
        'Initializing...'
      )}

      <footer>&copy; {new Date().getFullYear()} SKU</footer>
    </>
  )
}

export default App
