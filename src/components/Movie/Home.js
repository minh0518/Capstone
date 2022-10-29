import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CATEGORIES from '../../categories'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../styles/home.scss'
import { Box } from '../../styles/Container.styled'

const Home = ({ setMovieInfo }) => {
  const [koficInfo, setKoficInfo] = useState([])
  const [naverInfo, setNaverInfo] = useState([])
  const [nationCategory, setNationCategories] = useState('')
  const [multiCategory, setMultiCategorie] = useState('')

  // const styleObj = {
  //   display: 'flex',
  //   listStyle: 'none',
  // }

  const makeDate = () => {
    let today = new Date()
    let year = today.getFullYear() // 년도
    let month =
      ('' + (today.getMonth() + 1)).length === 1
        ? '0' + (today.getMonth() + 1)
        : today.getMonth() + 1 // 월
    let date =
      ('' + (today.getDate() - 1)).length === 1
        ? '0' + (today.getDate() - 1)
        : '' + today.getDate() - 1 // 날짜

    return [year, month, date].join('')
  }

  //영화진흥위원회 정보
  useEffect(() => {
    const getMovies = async () => {
      try {
        const nationQuery = nationCategory
          ? `&repNationCd=${nationCategory}`
          : ''
        const multiQuery = multiCategory ? `&multiMovieYn=${multiCategory}` : ''

        const date = makeDate()
        // console.log(date)
        let response = await axios.get(
          `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=a5ff207b0075a51ed12c42d6c4b67218&targetDt=${date}${nationQuery}${multiQuery}`,
        )

        // console.log(nationQuery)

        let list = response.data.boxOfficeResult.dailyBoxOfficeList
        setKoficInfo(list)
      } catch (e) {
        console.log(e)
      }
    }
    getMovies()
  }, [nationCategory, multiCategory])

  let NaverInfoArr = []

  console.log(naverInfo)

  //네이버영화 정보
  useEffect(() => {
    const getMovies = async () => {
      const ID_KEY = '7ZKljEdHUmg5R3Ny2sr3'
      const SECRET_KEY = 'Fk9VkXWZjQ'

      for (let i = 0; i < koficInfo.length; i++) {
        let response = await axios.get(`/v1/search/movie.json`, {
          params: {
            query: koficInfo[i].movieNm,
            display: 10,
          },
          headers: {
            'X-Naver-Client-Id': ID_KEY,
            'X-Naver-Client-Secret': SECRET_KEY,
          },
        })

        let NaverResult = []

        //response.data.items에는 네이버API로부터 받은
        //최대 10개의 영화정보가 들어있다
        //이것들을 필터링한 결과값을 NaverResult에 각각 1개씩 담는다

        //예술영화 같은 경우 애초에 네이버에서 받아지지 않는 경우가
        //존재한다 그래서 이럴땐 어쩔 수 없이 빈 문자열을 리턴
        if (response.data.items.length === 0) {
          NaverInfoArr.push({
            kofic: koficInfo[i],
            naver: '',
          })
        } else {
          NaverResult.push(
            filterTitle(response.data.items, koficInfo[i].movieNm),
          )

          NaverInfoArr.push({
            kofic: koficInfo[i],
            naver: NaverResult.shift(),
            //필터링이 실패한 경우 naver에 빈 문자열을 받을 수도 있다
          })
        }
      }

      //console.log(tmp)
      setNaverInfo(NaverInfoArr)
      setMovieInfo(NaverInfoArr) //여기서 카테고리로 만들어진 영화들이 상위(App.js)까지 전달
      //AppRouter에서 Detail컴포넌트로 넘겨줄때 사용 하기때문에 이것도 반드시 해줘야 한다
    }
    getMovies()
  }, [koficInfo])

  //setMovieInfo를 사용하는데  Home컴포넌트에서 사용되는 상태값인 naverInfo를 사용하면 ( setMovieInfo(naverInfo) )
  //에러가 발생한다
  //react-dom.development.js:86 Warning: Cannot update a component (`App`) while rendering a different component (`Home`). To locate the bad setState() call inside `Home` ..
  //console.log(naverInfo)
  //console.log(movieTitles)

  //네이버API에게 제목을 전달해주면 이상한 영화를 가져오는 경우가 많으므로
  //필터링 로직 추가
  const filterTitle = (arr, query) => {
    if (arr.length === 1) {
      //받아온 것이 1개뿐이면 그걸 그대로 사용
      return arr[0]
    } else {
      //<b></b>태그 제거 후 제목과 완전히 같은 것만 추출
      arr = arr.map((i) => {
        return {
          ...i,
          title: i.title.split('<b>').join('').split('</b>').join(''),
        }
      })
      arr = arr.filter((i) => {
        return i.title.replace(/(\s*)/g, '') === query.replace(/(\s*)/g, '')
        //영진회에서 주는 제목과 네이버에서 받아온 제목이 다를 수가 있다
        //대표적인 예가 띄워쓰기인데
        //영진회 > 블랙 팬서 , 네이버 > 블랙팬서
        //이럴때 위의 제목비교에서 에러를 발생한다
        //비교할 때 무조건 공백을 제거하고 비교
      })

      //근데 위에서도 제목이 같이 않는다면 arr은 남는게 없다
      //그래서 어쩔 수 없이 빈 문자열로 리턴
      if (!arr.length) {
        return ''
      }

      //그런데도 같은 제목의 영화가 존재할 수 있음
      //그래서 위의 필터링을 거쳤는데도 여러개가 아직 남아 있다면
      //개봉연도 중에서 가장 최근인 것으로 추출
      if (arr.length !== 1) {
        //아직 여러개가 남아 있다면
        //가장 원시적인 max값을 탐색. 우선 맨 앞의 값을 최댓값으로 넣어줌
        //네이버에는 pubDate가 없는 경우가 있으므로 없을땐 2020사용
        let mostRecent = arr[0].pubDate ? arr[0].pubDate : 2020
        arr.map((i) => {
          //네이버의 pubDate가 없는 경우에 그냥 2020으로 넣어줌(쩔 수 없음)
          i.pubDate = i.pubDate ? i.pubDate : 2020

          if (i.pubDate > mostRecent) {
            mostRecent = i.pubDate
          }
        })

        arr = arr.filter((i) => {
          return i.pubDate === mostRecent
        })
      }

      return arr[0] //shift해도 상관은 없는데 콘솔로그창에 찍어보기 위해
    }
  }

  return (
    <div>
      <div className="header">
        <div>
        <h2 className="pont">Box Office</h2>
        </div>
      </div>

      <Box>
        <ButtonGroup className="mb-2">
          {CATEGORIES.nationCategories.map((i, index) => {
            return (
              <Button
                id="categoryButton"
                onClick={() => {
                  setNationCategories(i.text)
                }}
              >
                {i.name}
              </Button>
            )
          })}
        </ButtonGroup>
      </Box>
      <Box>
        <ButtonGroup className="mb-2">
          {CATEGORIES.multiCategories.map((i, index) => {
            return (
              <Button
                id="categoryButton"
                onClick={() => {
                  setMultiCategorie(i.text)
                }}
              >
                {i.name}
              </Button>
            )
          })}
        </ButtonGroup>
      </Box>

      <Container>
        <Row>
          {naverInfo.map((i, index) => {
            // 빈 문자열 받으면 어쩔 수 없이 공백
            if (i.naver === '') {
              return ''
            } else {
              return (
                <Col lg={2} md={3} sm={6}>
                  <Card id="test">
                    <Card.Img variant="top" src={i.naver.image} />
                    <Card.Body>
                      <Card.Title>현재{index + 1}위</Card.Title>
                      <Card.Text>
                        <span>{i.kofic.movieNm}</span>
                      </Card.Text>
                      <Card.Text>
                        개봉일 <br />
                        {i.kofic.openDt}
                      </Card.Text>

                      <Link variant="primary" to={`/movie/detail/${index + 1}`}>
                        More
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              )
            }
          })}
        </Row>
      </Container>
      {/* <div style={styleObj}>
        {naverInfo.map((i, index) => {
          // 빈 문자열 받으면 어쩔 수 없이 공백
          if (i.naver === '') {
            return <h4>해당 영화 정보가 존재하지 않습니다</h4>
          } else {
            return (
              <div key={index} style={{ padding: '20px', paddingTop: '0px' }}>
                <h4>{index + 1}</h4>
                <img src={i.naver.image} alt="img" />
                <p key={index} style={{ height: '50px' }}>
                  {i.kofic.movieNm}
                </p>
                <ul style={{ paddingLeft: '0px', listStyle: 'none' }}>
                  <li>개봉일 {i.kofic.openDt}</li>
                  <li>
                    누적 관객 수
                    {i.kofic.audiAcc.replace(
                      /(\d)(?=(?:\d{3})+(?!\d))/g,
                      '$1,',
                    )}
                    명
                  </li>
                  {i.kofic.rankOldAndNew === 'NEW' ? (
                    <li style={{ color: 'red' }}>NEW!</li>
                  ) : (
                    ''
                  )}
                  <li>네이버 평점 {i.naver.userRating}</li>
                  <li>
                    출연{' '}
                    {i.naver.actor.length > 10
                      ? `${i.naver.actor.slice(0, 10)}...`
                      : i.naver.actor}
                  </li>
                </ul>

                <button>
                  <Link to={`/movie/detail/${index + 1}`}>More</Link>
                </button>

              </div>
            )
          }
        })}
      </div> */}
    </div>
  )
}

export default Home

//노마드 강의의 경우, 영화 전체를 보여주는 api와 디테일 api를 받는
//url이 각각 나뉘어져 있었다
//그래서 전체에서 usePramas로 id를 받아서 디테일페이지에서 다시 받았다

//근데 나의 경우는 좀 복잡한게
//2개의 api를 동시에 사용하고 이걸 그대로 들고가서
//여기서 세부내용을 뽑아내야 한다
