import { addDoc, collection } from 'firebase/firestore'
import React, { useState } from 'react'
import { dbService } from '../fbase'

const WriteReview = () => {
  const [review, setReview] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()

    const doc = await addDoc(collection(dbService, 'review'), {
      review,
      createdAt: Date.now(),
    })

    setReview('')
  }

  const onChange = (e) => {
    setReview(e.target.value)
  }

  return (
    <div>
        {/* 여기에 추가로 영화 선택 드롭박스(이 또한 DB에 따로 저장하고 가져와야 함) 
        (그리고 리뷰에 영화 제목도 같이 추가) */}

      <form onSubmit={onSubmit}>
        <input
          value={review}
          onChange={onChange}
          type="text"
          placeholder="What's on yout mind about this movie"
          maxLength={120}
        ></input>
        <input type="submit" value="작성하기" />
      </form>
    </div>
  )
}

export default WriteReview
