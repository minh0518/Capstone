import React, { useState } from 'react'
import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { dbService } from '../fbase'
import { Link } from 'react-router-dom'
import WriteReview from './WriteReview'

const Reviews = ({ thisReview, isOwner }) => {
  const [editing, setEditing] = useState(false)
  //수정상태인지 아닌지

  const [newReview, setNewReview] = useState(thisReview.context)
  //수정을 해도 기존의 값에서 수정해야 하므로 디폴트를 thisReview로

  // 클릭하면 수정상태 인지 아닌지 변경
  const toggleEditing = () => {
    setEditing((prev) => !prev)
  }

  console.log(thisReview.id)
  const onSubmit = async (e) => {
    e.preventDefault()

    //업데이트 로직 추가
    const updateResult = doc(dbService, 'reviews', `${thisReview.id}`)
    await updateDoc(updateResult, {
      ...thisReview,
      context: newReview,
      time: new Date().toLocaleString(),
    })

    alert('Update complete!')
    setEditing(false)
    //수정하고 나면 다시 원래 상태로 돌아가야 하므로 false로 수정
  }


  //여기 사용된 thisReview.id는 ShowReview에서 WriteReview에서 받아온 리뷰객체에서
  //추가로 id키값에다가 documentId를 넣어준 객체를 따로 또 만듭니다
  //그리고 그 객체를 바탕으로 리뷰를 보여주면서 이 컴포넌트에도 이 객체를
  //넘겨주고 있습니다. 그래서 thisReview.id가 documentId가 되는 것입니다

  const onChange = (e) => {
    setNewReview(e.target.value)
  }

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want delete this review?')

    if (ok) {
      await deleteDoc(doc(dbService, 'reviews', `${thisReview.id}`))
    }
  }

  return (
    <>
      <div>
        <li>
          {editing ? (
            <div>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  onChange={onChange}
                  placeholder="Edit your review"
                  value={newReview}
                  required
                />
                <input type="submit" value="Update review" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </div>
          ) : (
            <div>
              <h4>{thisReview.userName}</h4>
              {`${thisReview.rating} ${thisReview.context} ${thisReview.time}`}
              {isOwner && (
                <>
                  <button onClick={onDeleteClick}>삭제하기</button>
                  <button onClick={toggleEditing}>수정하기</button>
                </>
              )}
            </div>
          )}
        </li>
      </div>
    </>
  )
}

export default Reviews


