import { getDocs, addDoc, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { dbService } from '../../fbase'
import Reviews from './Reviews'

const ShowReview = ({ detailInfo, userObj }) => {
  const [reviews, setReviews] = useState([]) //firestore에 있는 전체 리뷰들 받아와서
  const [thisReview, setThisReview] = useState([]) //해당 영화의 리뷰만 받아옴

  useEffect(() => {
    const getReviews = async () => {
      const dbReviews = await getDocs(collection(dbService, 'reviews'))
      dbReviews.forEach((i) => {
        let obj = {
          ...i.data(),
          id: i.id, //fireStore의 각 문서의 고유한 id값. documentId
          //이 documentId를 사용하는 이유는 수정,삭제를 할 때 
          //해당 문서에 접근하기 위함입니다
        }

        setReviews((prev) => [obj, ...prev])
      })
    }
    getReviews()
  }, [])

  useEffect(() => {
    const getThisReviews = () => {
      reviews.map((i) => {
        if (i.title === detailInfo.kofic.movieNm) {
          setThisReview((prev) => [i, ...prev])
        }
      })
    }

    getThisReviews()
  }, [reviews])


  //console.log(reviews)
  console.log(thisReview)

  return (
    <div>
      <ul>
        {thisReview.map((i,index) => (
          <Reviews key={index} thisReview={i} isOwner={i.userId===userObj.uid}/>
        ))}

      
      </ul>

    </div>
  )
}

export default ShowReview
