import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { dbService } from '../fbase'
import { Link } from 'react-router-dom'
import WriteReview from './WriteReview'

const Reviews = ({ thisReview, isOwner }) => {




  return (
    <>
      <ul>
        {thisReview.map((i, index) => {
          return (
            <div key={index}>
              <li>{i.rating}</li>
              <li>{i.context}</li>
              <li>{i.time}</li>
              {isOwner?(<><button>수정</button>
                <button>삭제</button>
              </>):''
              

              }
            </div>
          )
        })}
      </ul>
    </>
  )
}

export default Reviews
