import React, { useEffect, useState } from 'react'
import AppRouter from './router/AppRouter'
import { authService, storageService } from './fbase'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import img from './img/defaultImg.PNG'





//�����α��� ���� ��й�ȣ 123456789

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser)
  const [init, setInit] = useState(false)
  //Firebase�� �� �ε� �� ������
  //��ٸ��� �ϱ� ���� ���°�

  //�׳� setState�Լ� �ϳ��� ��� ������
  //Home���� �̰� ����ϴ� ���̴�
  //���⿡�ٰ��� info������ ��� �޾��ش�

  const [movieInfo, setMovieInfo] = useState([])
  const [userObj, setUserObj] = useState(null)

  const [defaultProfileImg, setDefaultProfileImg] = useState('https://mblogthumb-phinf.pstatic.net/MjAyMDA2MTBfMTY1/MDAxNTkxNzQ2ODcyOTI2.Yw5WjjU3IuItPtqbegrIBJr3TSDMd_OPhQ2Nw-0-0ksg.8WgVjtB0fy0RCv0XhhUOOWt90Kz_394Zzb6xPjG6I8gg.PNG.lamute/user.png?type=w800')

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        //�α����� �� ����
        setIsLoggedIn(true)

        //�̰� ���� �ʿ������� �𸣰ڴµ� �켱
        //local login���� �ϸ� displayName�� null�̹Ƿ� �װ� �ٲ���
        if (user.displayName === null) {
          const name = user.email.split('@')[0]
          //updateProfile ���
          updateProfile(authService.currentUser, {
            displayName: name,
          })
        }

        // ���� ����. �������� ��� ������ �����ָ�, ���⼭ �ʿ��� �͸� useObj�� ���
        //  console.log(authService.currentUser)
        //  console.log(user)


        setUserObj({
          //������ ��� ������Ʈ���� uid�� displayName���� �������� �����ؾ� ��
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
