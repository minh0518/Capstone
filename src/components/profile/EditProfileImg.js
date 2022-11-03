import { authService, storageService, dbService } from '../../fbase'
import { updateProfile } from 'firebase/auth'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { doc, getDocs, addDoc, collection, updateDoc } from 'firebase/firestore'

//지금까지 프로필 업데이트를 하면 authService.currentUser , userObj , profile(firestore) 에 변경이 일어났다
//authService.currentUser를 변경하면 자동으로 userObj가 바뀌도록 했으므로 그건 상관이 없었으므로
//프로필을 변경하면 authService.currentUser와 profile(firestore) 두 군데를 바꿔줬다
//근데 미처 프로필 이미지를 바꿔주면 profile(firestore)를 바꿔놓지 않았다

//근데 직접profile을 참조하기 전까지 몰랐던 이유가
//post에서는 userObj기반으로 작성하고 post를 보여줄땐 post에 작성된 것을 기반으로 보여줬으며
//chat에서는 post기반으로 상대방 정보를 가져오고 , 내가 보내는 메세지는 userObj기반으로 사용했다

//심지어 MyProfile컴포넌트에서도 유저들의 정보를 userObj를 바탕으로 보여주고 있다 profile(firestore)의 값으로 해주는게
//훨씬 안정적일것 같다(추후 리팩토링 필요)

//그래서 여기서도 반드시, 프로필 이미지를 변경할 때 profile(firestore)또한 업데이트 해줘야 한다

const EditProfileImg = ({ userObj }) => {
  //이미지 관련 상태 추가
  const [attachment, setAttachment] = useState('')

  const [profileID, setProfileID] = useState({
    documentId: '',
  })

  //이건 특정 기능을 하는건 아니고 프로필 이미지가 바뀌면
  //다른 페이지의 모든 프로필부분들을 다 바꾸기 위해
  //useEffect를 실행시켜야 하는데 그 의존성 배열로 사용하기 위해
  //추가한 상태값이다
  const [ImgUrl, setImgUrl] = useState('')

  const [changeImgonChatDialogInfo, setChangeImgonChatDialogInfo] = useState([])

  useEffect(() => {
    const getProfiles = async () => {
      const profiles = await getDocs(collection(dbService, 'profiles'))

      profiles.forEach((i) => {
        if (i.data().uid === userObj.uid) {
          setProfileID({
            documentId: i.id,
          })
        }
      })
    }

    getProfiles()
  }, [])

  //sender receiver 찾지 말고 그냥 userObj랑 uid가 같은 이름 변경하면 됨
  //uid가 같은것에 따라서 sender이닞 receiver인지만 구분해서
  //userObj의 displayName으로 바꾸면 됨
  useEffect(() => {
    const changeImgonChatDialog = async () => {
      
      const getChatList = await getDocs(collection(dbService, 'chatTest'))

      //전체 결과
      //즉, chatList를 다 돌면서 바꿔야 할 documentid와 , 바뀐 이미지를 포함한 dialog들을
      //한 세트로 가지고 있는 객체 >> 이것들을 여러개 가지고 있음
      //즉 이걸로 마지막에 setChangeImgonChatDialogInfo해주면 됨
      let result = []

      getChatList.forEach((i) => {
        let modifiedchats = []

        if ( //대화에 내가 이미지를 바꾼 계정이 있다면
          i.data().receiverId === userObj.uid ||
          i.data().senderId === userObj.uid
        ) {
          i.data().dialog.map((singledialog) => {
            if (singledialog.senderId === userObj.uid) { //그 대화의 이미지들을 죄다 바꿔서 다시 생성함
              modifiedchats.push({
                ...singledialog,
                senderImg: ImgUrl,
              })
            } else {
              modifiedchats.push(singledialog)
            }
          })

          //chatList단위로 push
          result.push({
            targetDocumentId: i.id,
            targetDialog: modifiedchats,
          })
        }
      })

      setChangeImgonChatDialogInfo(result)
    }

    changeImgonChatDialog()
  }, [ImgUrl])

  console.log(changeImgonChatDialogInfo)

  useEffect(() => {

    const changeImg = async () => {
      for (let i = 0; i < changeImgonChatDialogInfo.length; i++) {
        await updateDoc(
          doc(dbService, 'chatTest', `${changeImgonChatDialogInfo[i].targetDocumentId}`),{
            dialog:changeImgonChatDialogInfo[i].targetDialog
          }
        )
      }
    }

    changeImg()

  }, [changeImgonChatDialogInfo])

  const onFileChange = (e) => {
    const theFile = e.target.files[0]

    const reader = new FileReader()

    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent)

      const { currentTarget: result } = finishedEvent
      setAttachment(result.result)
    }
    reader.readAsDataURL(theFile)
  }

  //사진 등록 취소
  const onClearAttachment = (e) => {
    setAttachment(null)
    fileInput.current.value = ''
    //clear버튼 누르면 빈 문자열로 초기화
  }
  const fileInput = useRef()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()

    //storage참조를 만들고
    //대화용 사진도 따로 저장해야 하므로 디렉토리 구분 (/profileImg/)
    //읽기 편하게 폴더 이름을 userObj.uid대신 userObj.displayName로 수정
    const fileRef = ref(
      storageService,
      `${userObj.displayName}/profileImg/${uuidv4()}`,
    )

    //그 참조경로에다가 사진을 올린다
    const response = await uploadString(fileRef, attachment, 'data_url')

    //그리고 public url을 받아온다
    const attachmentUrl = await getDownloadURL(fileRef)
    setImgUrl(attachmentUrl)

    if (attachmentUrl !== authService.currentUser.photoURL) {
      //바꾸려는 이미지가 다른 경우에만
      await updateProfile(authService.currentUser, {
        photoURL: attachmentUrl,
      })

      //위에서 말한 profile(firestore) 사진부분 업데이트
      //실제로 사용할 때 여기까지 진행되려면 시간이 걸리므로 최소 3초 이상은 기다려야 함
      await updateDoc(doc(dbService, 'profiles', `${profileID.documentId}`), {
        photoURL: attachmentUrl,
      })
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="등록" />

        {attachment && (
          <>
            <img src={attachment} width="50px" height="50px" alt="img" />
            <button onClick={onClearAttachment}>Clear</button>
          </>
        )}
      </form>
    </div>
  )
}

export default EditProfileImg
