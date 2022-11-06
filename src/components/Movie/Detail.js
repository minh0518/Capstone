//각 영화에 대한 차트 및 리뷰를 담당하는 페이지입니다
//세션스토리지를 통해 새로고침을 해도 api로 호출한 정보가 끊기지 않게 처리했습니다


import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import WriteReview from './WriteReview'
import ShowReview from './ShowReview'
import '../../styles/detail.scss'
import ListGroup from 'react-bootstrap/ListGroup'
import Charts from './Charts'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

const Detail = ({ userObj }) => {

  const { id } = useParams()
  const [detailInfo, setDetailInfo] = useState('')
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
    const getMoviesFromstorage = () => {
      let result = JSON.parse(sessionStorage.getItem('movies'))

      console.log(result[id - 1])
      setDetailInfo(result[id - 1])
    }

    getMoviesFromstorage()
  }, [])

  return (
    <div>
      {detailInfo ? (
        <div className="first">
          <div className="second">
            <div>
              <img
                src={detailInfo.naver.image}
                width="170px"
                height="250px"
                alt="img"
              ></img>
            </div>
            <div className="info">
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
          <hr />

          <Charts detailInfo={detailInfo} />

          <hr />

          <div style={{ marginTop: '50px' }}>
            <Container>
              <Row>
                <Col xs={12} md={12} lg={12}></Col>
              </Row>
            </Container>
            <ShowReview detailInfo={detailInfo} userObj={userObj} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Detail
