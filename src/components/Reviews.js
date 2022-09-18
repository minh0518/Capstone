import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { dbService } from '../fbase'
import { Link } from 'react-router-dom'
import WriteReview from './WriteReview'

const Reviews = ({ thisReview, isOwner }) => {




  return (
    <>
     
     
          <div>
            <li>
              <div>
                <h4>{thisReview.userName}</h4>
                {`${thisReview.rating} ${thisReview.context} ${thisReview.time}`}
              </div>
            </li>
          </div>
     
     
    </>
  )
}

export default Reviews
