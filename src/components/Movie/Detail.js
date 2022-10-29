import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import WriteReview from './WriteReview'
import ShowReview from './ShowReview'
import '../../styles/detail.scss'
import ListGroup from 'react-bootstrap/ListGroup'
import Charts from './Charts'

const Detail = ({ movieInfo, userObj }) => {
  //왜 새로고침하면 movieInfo가 없어지는거지?

  const { id } = useParams()
  const [detailInfo, setDetailInfo] = useState(movieInfo[id - 1])
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

  return (
    <div className="first">
      <div className="second">
        <div className={`imgPart${moveFlag}`}>
          <img
            src={detailInfo.naver.image}
            width="170px"
            height="250px"
            alt="img"
          ></img>
        </div>
        <div className={`infoPart${moveFlag}`}>
          <ListGroup variant="flush">
            <ListGroup.Item>현재 {detailInfo.kofic.rank}위</ListGroup.Item>
            <ListGroup.Item>
              <h5>개봉일</h5>
              {detailInfo.kofic.openDt}
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>관객수</h5>
              {detailInfo.kofic.audiAcc.replace(
                /(\d)(?=(?:\d{3})+(?!\d))/g,
                '$1,',
              )}
              명
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>감독</h5> {detailInfo.naver.director.split('|').join('')}
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>출연</h5>
              {detailInfo.naver.actor.split('|').join(',')}
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>네이버 평점</h5>
              {detailInfo.naver.userRating}
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>

            {/* <Charts detailInfo={detailInfo}/> */}
      <div>
        <button name="reviewMode" onClick={onToggleChange}>
          리뷰
        </button>
        {reviewMode ? (
          <>
            <ShowReview detailInfo={detailInfo} userObj={userObj} />
            <button name="writeMode" onClick={onToggleChange}>
              작성하기
            </button>
            {writeMode ? (
              <WriteReview detailInfo={detailInfo} userObj={userObj} />
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
      </div>

    </div>
  )
}

export default Detail
