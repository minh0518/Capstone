//Home페이지에서 Detail페이지로 넘어가기 전에 아주 간단한 영화 정보를 
//나열해주는 공간입니다 (제조사 , 영화관람등급 , 상영시간 등..)

import React, { useState, useEffect } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'
import axios from 'axios'

const MovieCompanyInfo = ({ movieCd,index }) => {
  const [show, setShow] = useState(false)
  const [movieDetail, setMovieDetail] = useState({})

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  //영화진흥위원회 정보
  useEffect(() => {
    const getMovies = async () => {
      try {
        let response = await axios.get(
          `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=a5ff207b0075a51ed12c42d6c4b67218&movieCd=${movieCd}`,
        )

        //console.log(response.data)

        setMovieDetail(response.data.movieInfoResult.movieInfo)
      } catch (e) {
        console.log(e)
      }
    }
    getMovies()
  }, [])

  //회사들
  //장르
  //관람등급
  //감독

  console.log(movieDetail)
  return (
    <>
     <Button onClick={handleShow} variant="light">Info.</Button>

      {show && (
        <>
          <Offcanvas show={show} onHide={handleClose} placement="bottom">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Info</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Container>
                <Row>
                  <Col>
                    <Card border="light" style={{ width: '18rem' }}>
                      <Card.Header>배급 및 제작</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          {movieDetail.companys.map((i) => {
                            return <p>{i.companyNm}</p>
                          })}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card border="light" style={{ width: '10rem' }}>
                      <Card.Header>장르</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          {movieDetail.genres.map((i) => {
                            return <p>{i.genreNm}</p>
                          })}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card border="light" style={{ width: '12rem' }}>
                      <Card.Header>관람등급</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          {movieDetail.audits.map((i) => {
                            return <p>{i.watchGradeNm}</p>
                          })}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card border="light" style={{ width: '18rem' }}>
                      <Card.Header>감독</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          {movieDetail.directors.map((i) => {
                            return <p>{i.peopleNm}</p>
                          })}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card border="light" style={{ width: '10rem' }}>
                      <Card.Header>상영시간</Card.Header>
                      <Card.Body>
                        <Card.Text>{movieDetail.showTm}분</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                    <Col><Button variant="dark">
                    <Link
                    variant="primary"
                    to={`/movie/detail/${index + 1}`}
                    style={{ textDecoration: 'none', color: 'white' }}
                    
                  >리뷰 및 차트</Link></Button></Col>
                </Row>
              </Container>

        
            </Offcanvas.Body>
          </Offcanvas>
        </>
      )}
    </>
  )
}

export default MovieCompanyInfo
