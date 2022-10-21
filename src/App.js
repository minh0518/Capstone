import React, { useEffect, useState } from 'react'
import AppRouter from './router/AppRouter'
import { authService, storageService } from './fbase'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import img from './img/defaultImg.PNG'





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
  const [userObj, setUserObj] = useState(null)

  const [defaultProfileImg, setDefaultProfileImg] = useState('https://mblogthumb-phinf.pstatic.net/MjAyMDA2MTBfMTY1/MDAxNTkxNzQ2ODcyOTI2.Yw5WjjU3IuItPtqbegrIBJr3TSDMd_OPhQ2Nw-0-0ksg.8WgVjtB0fy0RCv0XhhUOOWt90Kz_394Zzb6xPjG6I8gg.PNG.lamute/user.png?type=w800')

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        //로그인이 된 상태
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

        // 둘이 같음. 유저관련 모든 정보를 보여주며, 여기서 필요한 것만 useObj로 사용
        //  console.log(authService.currentUser)
        //  console.log(user)


        setUserObj({
          //앞으로 모든 컴포넌트에서 uid나 displayName으로 유저들을 구분해야 함
          displayName: user.displayName,
          uid: user.uid,
          // profileImg: defaultProfileImg,
          photoURL:user.photoURL,
        })
      } else {
        setIsLoggedIn(false)
        setUserObj(null)
      }
      setInit(true)
    })
  }, [])



  console.log(userObj)

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
