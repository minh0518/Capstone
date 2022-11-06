import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const UsersPickMovie = ({ userObj }) => {
  const { id, movieName } = useParams()

  const [show, setShow] = useState(true)

  const navigate = useNavigate()

  //show를 false로 해줄 필요 없이 그냥 뒤로가기 해버림
  const handleClose = () => {
    navigate(-1)
  }

  const [movies, setMovies] = useState([])

  let NaverInfoResult = []

  useEffect(() => {
    const getMovies = async () => {
      const ID_KEY = '7ZKljEdHUmg5R3Ny2sr3'
      const SECRET_KEY = 'Fk9VkXWZjQ'

      let response = await axios.get(`/v1/search/movie.json`, {
        params: {
          query: movieName,
          display: 20,
        },
        headers: {
          'X-Naver-Client-Id': ID_KEY,
          'X-Naver-Client-Secret': SECRET_KEY,
        },
      })

      let NaverFilterResult = []


      if (response.data.items.length === 0) {
        NaverInfoResult.push('')
      } else {
        NaverInfoResult.push(
          filterTitle(response.data.items, movieName),
          //필터링이 실패한 경우 빈 문자열을 받을 수도 있다
        )
      }

      setMovies(NaverInfoResult)
    }
    getMovies()
  }, [])

  //console.log(bestPick)
  console.log(movies[0])

  const filterTitle = (arr, query) => {
    if (arr.length === 1) {
      return arr
    } else {
      arr = arr.map((i) => {
        return {
          ...i,
          title: i.title.split('<b>').join('').split('</b>').join(''),
        }
      })

      arr = arr.filter((i) => {
        return i.title.replace(/(\s*)/g, '') === query.replace(/(\s*)/g, '')
      })

      if (!arr.length) {
        return ''
      }

      //여기서는 필터링 된 영화들을 최신순으로 구분하면 안된다 (옛날 영화들 일수도 있기 때문)
      // 그래서 이 로직은 제거한다
      // if (arr.length !== 1) {
      //   let mostRecent = arr[0].pubDate ? arr[0].pubDate : 2020
      //   arr.map((i) => {
      //     i.pubDate = i.pubDate ? i.pubDate : 2020

      //     if (i.pubDate > mostRecent) {
      //       mostRecent = i.pubDate
      //     }
      //   })

      //   arr = arr.filter((i) => {
      //     return i.pubDate === mostRecent
      //   })
      // }


      return arr
      //Home에서 사용된 로직과 다르게
      //여기선 arr을 리턴한다
      //즉, 하나의 필터링된 영화만 리턴하는게 아니라
      //최소한의 필터링을 거친 여러 영화들을 리턴하는 것이다
    }
  }

  

  // 구조가 지금 movies = [Array(5)]이므로
  // movies[0]에 접근해야 정보가 존재한다
  return (
    <Offcanvas show={show} onHide={handleClose} placement="bottom">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{movieName}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {movies[0] ? (

          <Container>
            <Row>
              {movies[0].map((i) => {
                if(i.image&&i.link){
                  return (
                    <Col xl={3} md={4} sm={6}>
                      <Card style={{ width: '9rem' }}>
                        <Card.Img variant="top" src={i.image} />
                        <Card.Body>
                          <Card.Title>{movieName}</Card.Title>
                          <Card.Text>{i.pubDate}</Card.Text>
                          <Button variant="success">Naver</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                }
                else{
                  return <></>
                }

              })}
            </Row>
          </Container>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Spinner animation="border" />
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default UsersPickMovie
