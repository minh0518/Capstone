import React, { useEffect, useState } from 'react'
import AppRouter from './router/AppRouter'
import { authService, dbService } from './fbase'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { getDocs, addDoc, collection } from 'firebase/firestore'
import { Container } from './styles/Container.styled'

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

  const [profileInfo, setProfileInfo] = useState(null)

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
        // console.log(authService.currentUser)
        //  console.log(user)

        //userObj는 반드시 현재 로그인 되어 있는 사용자의 정보로만 사용돼야 합니다
        setUserObj({
          //앞으로 모든 컴포넌트에서 uid나 displayName으로 유저들을 구분해야 함
          displayName: user.displayName,
          uid: user.uid,
          // profileImg: defaultProfileImg,
          photoURL: user.photoURL,
        })

        setProfileInfo({
          displayName: user.displayName,
          uid: user.uid,
          birth: '',
          preferredGenre: [],
          bestPick: [],
          photoURL: user.photoURL,
        })
      } else {
        setIsLoggedIn(false)
        setUserObj(null)
        setProfileInfo(null)
      }
      setInit(true)
    })
  }, [])

  //console.log(authService.currentUser)

  //다른 곳에서 updateProfile을 사용하면
  //여기에도 바로 반영이 되는건지 확인을 해야 함
  //console.log(userObj)

  useEffect(() => {
    //프로필을 firestore에 등록
    const generateProfileOnDB = async () => {
      if (userObj) {
        let arr = []
        //프로필이 기존에 존재한다면 해당 documentId를 넣어둠

        const dbProfiles = await getDocs(collection(dbService, 'profiles'))

        dbProfiles.forEach((i) => {
          if (i.data().uid === userObj.uid) {
            arr.push(i.id)
          }
        })

        //기존에 존재하는 것이 아니라면 새로 추가
        if (arr.length === 0) {
          const doc = await addDoc(collection(dbService, 'profiles'), {
            ...profileInfo,
          })
        } else {
          //기존에 존재한다면 프로필을 업데이트 (이미 존재하는데 userObj가 바뀐것은 수정이 발생한 것이므로)
        }
      }
    }

    generateProfileOnDB()
  }, [userObj])

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

      {/* <footer>&copy; {new Date().getFullYear()} SKU</footer> */}
    </>
  )
}

export default App
