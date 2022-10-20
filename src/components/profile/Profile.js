import { authService } from '../../fbase'
import { signOut } from 'firebase/auth'
import React, { useState , useRef} from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = ({userObj}) => {


  //이미지 관련 상태 추가
  const [attachment,setAttachment]=useState('')

  const onLogOutClick = () => {
    signOut(authService)
    navigate('/')
  }

  //useNavigate()사용
  const navigate = useNavigate()


  const onFileChange=(e)=>{


    const theFile=e.target.files[0]

    const reader=new FileReader()
    reader.onloadend=finishedEvent=>{
      console.log(finishedEvent)


      const {currentTarget:result}=finishedEvent
      setAttachment(result.result)
    }
    reader.readAsDataURL(theFile)
  }


  	//사진 등록 취소
	const onClearAttachment = (e) => {
    setAttachment(null)
    fileInput.current.value=''
		//clear버튼 누르면 빈 문자열로 초기화
  }

  const fileInput=useRef()

  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>

      <form onSubmit=''>
        <input type='file' accept='image/*' onChange={onFileChange} ref={fileInput}/>
        <input type='submit' value='사진' />

        {attachment&&(
          <>
            <img src={attachment} width='50px' height='50px' alt='img' />
            <button onClick={onClearAttachment}>Clear</button>
          </>
        )}
      </form>
    </div>
  )
}

export default Profile
