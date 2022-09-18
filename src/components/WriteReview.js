import { addDoc, collection } from 'firebase/firestore'
import React, { useState } from 'react'
import { dbService } from '../fbase'

const WriteReview = ({ detailInfo, userObj }) => {
  const [newReview, setNewReview] = useState({
    context: '',
    title: detailInfo.kofic.movieNm,
    rating: '',
    userName: userObj.displayName,
    userId: userObj.uid,
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    const doc = await addDoc(collection(dbService, 'reviews'), {
      ...newReview,
      time: new Date().toLocaleString(),
    })

    console.log(userObj.displayName)
    setNewReview({
      context: '',
      title: detailInfo.kofic.movieNm,
      rating: '',
      userName: userObj.displayName, //이것들은 로그인하는 동안 불변하는것이고 입력창에도 없는데 굳이 빈 값으로 초기화할 필요가 있나?
      userId: userObj.uid,
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
      })) //패턴필기
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
          placeholder="What's on yout mind about this movie"
          maxLength={120}
        ></input>
        <input
          name="rating"
          value={newReview.rating}
          onChange={onChange}
          type="text"
          placeholder="rating"
          maxLength={10}
        ></input>

        <input type="submit" value="등록" />
      </form>
    </div>
  )
}

export default WriteReview
