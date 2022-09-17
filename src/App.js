import React, { useEffect, useState } from 'react'
import { Router } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import Auth from './components/Auth'
import firebase from './fbase'
import { authService } from './fbase'
import { onAuthStateChanged,updateProfile } from 'firebase/auth'

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

  const [userObj,setUserObj]=useState(null)

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) { //�α����� �� ����
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

        setUserObj({
          //������ ��� ������Ʈ���� uid�� displayName���� �������� �����ؾ� ��
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


  //���⼱ ���ʿ� ���� ������ ��ü�� �����Ƿ�
  //������ �������� ����� ��

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
