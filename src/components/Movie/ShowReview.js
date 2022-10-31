import { getDocs, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import WriteReview from './WriteReview'
import { dbService } from '../../fbase'
import ReviewsForName from './ReviewsForName'
import '../../styles/showReview.scss'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import ReviewsForOthers from './ReviewsForOthers'
import Container from 'react-bootstrap/Container'

const ShowReview = ({ detailInfo, userObj }) => {
  const [reviews, setReviews] = useState([]) //firestore에 있는 전체 리뷰들 받아와서
  const [thisReview, setThisReview] = useState([]) //해당 영화의 리뷰만 받아옴


  const [reviewMode, setReviewMode] = useState(false)
  const [writeMode, setWriteMode] = useState(false)
  const [moveFlag, setMoveFlag] = useState(false)


  const onToggleChange = (e) => {
    const { name, value } = e.target

    if (name === 'reviewMode') {
      setReviewMode((prev) => !prev)
      setMoveFlag((prev) => !prev)
    } else if (name === 'writeMode') {
      setWriteMode((prev) => !prev)
    }
  }

  useEffect(() => {
    const getReviews = async () => {
      const dbReviews = await getDocs(collection(dbService, 'reviews'))
      dbReviews.forEach((i) => {
        let obj = {
          ...i.data(),
          id: i.id, //fireStore의 각 문서의 고유한 id값. documentId
          //이 documentId를 사용하는 이유는 수정,삭제를 할 때
          //해당 문서에 접근하기 위함입니다
          //db에 있는 값에 id라는 키가 없어도 이건 자동으로 사용할 수 있는 것입니다
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

  console.log(thisReview)

  return (
    <div className="reviews">
      <Container>
        <h3>Reviews</h3>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Tab.Container
              id="list-group-tabs-example"
              defaultActiveKey="#link1"
            >
              <Row>
                <Col sm={4}>
                  {thisReview.map((i, index) => (
                    <ReviewsForName
                      key={index}
                      thisReview={i}
                      linkNum={index + 1}
                    />
                  ))}
                </Col>

                <Col sm={8}>
                  {thisReview.map((i, index) => (
                    <ReviewsForOthers
                      key={index}
                      thisReview={i}
                      linkNum={index + 1}
                      isOwner={i.userId === userObj.uid}
                    />
                  ))}
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
        <button name="writeMode" onClick={onToggleChange}>
              작성하기
            </button>
            {writeMode ? (
              <WriteReview detailInfo={detailInfo} userObj={userObj} />
            ) : (
              ''
            )}
      </Container>
    </div>
  )
}

export default ShowReview
