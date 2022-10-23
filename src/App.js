import React, { useEffect, useState } from 'react'
import AppRouter from './router/AppRouter'
import { authService, dbService } from './fbase'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { getDocs, addDoc, collection } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

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

  const [profileInfo, setProfileInfo] = useState(null)

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
        // console.log(authService.currentUser)
        //  console.log(user)

        //userObj�� �ݵ�� ���� �α��� �Ǿ� �ִ� ������� �����θ� ���ž� �մϴ�
        setUserObj({
          //������ ��� ������Ʈ���� uid�� displayName���� �������� �����ؾ� ��
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



  console.log(authService.currentUser)

  //�ٸ� ������ updateProfile�� ����ϸ�
  //���⿡�� �ٷ� �ݿ��� �Ǵ°��� Ȯ���� �ؾ� ��
  console.log(userObj)


  useEffect(() => {

    //�������� firestore�� ���
    const generateProfileOnDB = async () => {
      if (userObj) {

        let arr = []
        //�������� ������ �����Ѵٸ� �ش� documentId�� �־��

        const dbProfiles = await getDocs(collection(dbService, 'profiles'))

        dbProfiles.forEach((i) => {
          if (i.data().uid === userObj.uid) {
            arr.push(i.id)
          }
        })

        //������ �����ϴ� ���� �ƴ϶�� ���� �߰�
        if (arr.length === 0) {
          const doc = await addDoc(collection(dbService, 'profiles'), {
            ...profileInfo,
          })
        }
        else{//������ �����Ѵٸ� �������� ������Ʈ (�̹� �����ϴµ� userObj�� �ٲ���� ������ �߻��� ���̹Ƿ�)
          
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

      <footer>&copy; {new Date().getFullYear()} SKU</footer>
    </>
  )
}

export default App
