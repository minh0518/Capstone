import { authService, storageService } from '../../fbase'
import { updateProfile } from 'firebase/auth'
import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

const EditProfile = ({ userObj }) => {
  //이미지 관련 상태 추가
  const [attachment, setAttachment] = useState('')

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

    if (attachmentUrl !== authService.currentUser.photoURL) {
      //바꾸려는 이미지가 다른 경우에만
      await updateProfile(authService.currentUser, {
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

export default EditProfile
