import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import WriteReview from './WriteReview'
import ShowReview from './ShowReview'
import '../../styles/detail.scss'

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
    <div>
      <div className={`movieDetail`}>
        <div>
          <img
            src={detailInfo.naver.image}
            width="170px"
            height="250px"
            alt="img"
          ></img>
        </div>
        {moveFlag && (
          <div className={`movieDetail`}>
            <div>
              <h3>{detailInfo.kofic.movieNm}</h3>
              <ul>
                <li>개봉일 {detailInfo.kofic.openDt}</li>
                <li>
                  관객수
                  {detailInfo.kofic.audiAcc.replace(
                    /(\d)(?=(?:\d{3})+(?!\d))/g,
                    '$1,',
                  )}
                </li>
                <li>감독 {detailInfo.naver.director.split('|').join('')}</li>
                <li>출연 {detailInfo.naver.actor.split('|').join(',')}</li>
                <li>평점 {detailInfo.naver.userRating}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {moveFlag ? (
        ''
      ) : (
        <div className={`movieDetail`}>
          <div>
            <h3>{detailInfo.kofic.movieNm}</h3>
            <ul>
              <li>개봉일 {detailInfo.kofic.openDt}</li>
              <li>
                관객수
                {detailInfo.kofic.audiAcc.replace(
                  /(\d)(?=(?:\d{3})+(?!\d))/g,
                  '$1,',
                )}
              </li>
              <li>감독 {detailInfo.naver.director.split('|').join('')}</li>
              <li>출연 {detailInfo.naver.actor.split('|').join(',')}</li>
              <li>평점 {detailInfo.naver.userRating}</li>
            </ul>
          </div>
        </div>
      )}

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
  )
}

export default Detail
