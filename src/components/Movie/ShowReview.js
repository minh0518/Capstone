import { getDocs, addDoc, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { dbService } from '../../fbase'
import Reviews from './Reviews'

const ShowReview = ({ detailInfo, userObj }) => {
  const [reviews, setReviews] = useState([]) //firestore�� �ִ� ��ü ����� �޾ƿͼ�
  const [thisReview, setThisReview] = useState([]) //�ش� ��ȭ�� ���丸 �޾ƿ�

  useEffect(() => {
    const getReviews = async () => {
      const dbReviews = await getDocs(collection(dbService, 'reviews'))
      dbReviews.forEach((i) => {
        let obj = {
          ...i.data(),
          id: i.id, //fireStore�� �� ������ ������ id��. documentId
          //�� documentId�� ����ϴ� ������ ����,������ �� �� 
          //�ش� ������ �����ϱ� �����Դϴ�
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
