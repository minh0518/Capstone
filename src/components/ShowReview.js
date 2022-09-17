import { getDocs, addDoc, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { dbService } from '../fbase'
import Reviews from './Reviews'

const ShowReview = ({ detailInfo,userObj }) => {
  const [reviews, setReviews] = useState([]) //firestore에 있는 전체 리뷰들 받아와서
  const [thisReview, setThisReview] = useState([]) //해당 영화의 리뷰만 받아옴

  useEffect(() => {
    const getReviews = async () => {
      const dbReviews = await getDocs(collection(dbService, 'reviews'))
      dbReviews.forEach((i) => {
        let obj = {
          ...i.data(),
          id: i.id, //fireStore의 각 문서의 고유한 id값
        }
        //data말고 id도 같이 묶어서 사용하기 위해 이렇게 추가로 obj에
        //묶어서 사용 (패턴 필기)
        setReviews((prev) => [obj, ...prev])
        //(패턴 필기)

        
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
  //useEffect분리하는거 패턴 필기

  //console.log(reviews)
  console.log(thisReview)

  
  return (
    <div>
        {thisReview.map((i)=>{
          <>{i.id}</>
        })}
        
                                       {/* 삭제,수정을 위해 isOwner도 같이 사용 */}
        {/* <Reviews thisReview={thisReview} isOwner={(userObj.uid===thisReview.userId)}/> */}
    </div>
    
  )
}

export default ShowReview

