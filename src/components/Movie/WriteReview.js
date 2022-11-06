//리뷰를 새로 작성하는 페이지입니다
//ShowReview페이지에서 기존 리뷰들 목록을 보여줌과 동시에
//여기서 새로운 리뷰를 작성하고자 한다면 이 페이지를 호출하게 되는 것입니다

import { addDoc, collection } from 'firebase/firestore'
import React, { useState } from 'react'
import { dbService } from '../../fbase'

const WriteReview = ({ detailInfo, userObj }) => {
  const [newReview, setNewReview] = useState({
    context: '',
    title: detailInfo.kofic.movieNm,
    rating: '',
    userName: userObj.displayName,
    userId: userObj.uid,
    userImg : userObj.photoURL
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    const doc = await addDoc(collection(dbService, 'reviews'), {
      ...newReview,
      time: new Date().toLocaleString(),
    })

    setNewReview({
      context: '',
      title: detailInfo.kofic.movieNm,
      rating: '',
      userName: userObj.displayName, //이것들은 로그인하는 동안 불변하는것이고 입력창에도 없는데 굳이 빈 값으로 초기화할 필요가 있나?
      userId: userObj.uid,
      userImg : userObj.photoURL
    })

    console.log(newReview)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    // const {target:{name,value}}=e
    if (name === 'context') {
      setNewReview((prev) => ({
        ...prev,
        context: value,
      })) 
    }
    if (name === 'rating') {
      setNewReview((prev) => ({
        ...prev,
        rating: value,
      })) //리뷰내용 수정이면 그것만 바꿔주고 레이팅수정이면 그것만 바꿔주도록 함
    }
  }

  return (
    <div>


      <form onSubmit={onSubmit}>
        <input
          name="context"
          value={newReview.context} 
          onChange={onChange}
          type="text"
          placeholder="리뷰를 작성해주세요 (최대 120자)"
          maxLength={120}
          style={{width:'600px'}}
        ></input>
        <input
          name="rating"
          value={newReview.rating}
          onChange={onChange}
          type="number"
          placeholder="평점"
          step='0.5'
          min="1" max="10"
        ></input>

        <input type="submit" value="등록" />
      </form>
    </div>
  )
}

export default WriteReview
