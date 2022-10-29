import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

const Recommand = ({ preferredGenre }) => {
  const [koficInfo, setKoficInfo] = useState([])
  const [naverInfo, setNaverInfo] = useState([])

  const genre = {
    ALL: '',
    드라마: 1,
    판타지: 2,
    서부: 3,
    공포: 4,
    로맨스: 5,
    모험: 6,
    스릴러: 7,
    느와르: 8,
    컬트: 9,
    다큐멘터리: 10,
    코미디: 11,
    가족: 12,
    미스터리: 13,
    전쟁: 14,
    애니메이션: 15,
    범죄: 16,
    뮤지컬: 17,
    SF: 18,
    액션: 19,
    무협: 20,
  }
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
        const date = makeDate()
        // console.log(date)
        let response = await axios.get(
          `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=a5ff207b0075a51ed12c42d6c4b67218&targetDt=${date}`,
        )

        let list = response.data.boxOfficeResult.dailyBoxOfficeList
        setKoficInfo(list)
      } catch (e) {
        console.log(e)
      }
    }
    getMovies()
  }, [preferredGenre])

  let NaverInfoArr = []

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
            genre: genre[preferredGenre],
          },
          headers: {
            'X-Naver-Client-Id': ID_KEY,
            'X-Naver-Client-Secret': SECRET_KEY,
          },
        })

        //장르에 없는 것들은 제외하고 받음
        //네이버의 리턴값이 배열로 된 형태라 값이 없는지 확인하기 위해 .length 사용
        if (response.data.items.length) {
          //console.log(response.data.items)

          let NaverResult = []

          let result = filterTitle(
            response.data.items,
            koficInfo[i].movieNm,
            koficInfo[i].openDt,
          )

          // console.log(koficInfo[i])
          // console.log(result)

          if (result) {
            NaverResult.push(result)
            NaverInfoArr.push({
              kofic: koficInfo[i],
              naver: NaverResult.shift(),
            })
          }
        }
      }
      setNaverInfo(NaverInfoArr)
    }
    getMovies()
  }, [koficInfo])

  //여기서 사용하는 필터로직은 조금 다르다
  //영진회에서 제목을 받은 다음 , 그 제목+장르 이렇게 네이버에서 검색하기 때문에
  //엉뚱한 값이 나올 수 있다
  //즉 , '인생은 아름다워' 라는 영화가 있으면
  //그냥 '인생은 아름다워' 검색하는 것은 Home컴포넌트에서 사용한 필터링 로직이 먹히는데
  //여기서는 ('인생은 아름다워'+장르) 이렇게 검색하기때문에 완전 옛날 영화가 나올때가 있고
  //이건 연도를 최근것으로 땡겨오는게 의미가 없다 2001년것하고 1998년것에서 2001년 것을 가져온다고
  //그게 올바른게 아니기 때문이다

  //그래서 어쩔 수 없이 영진회에서 제공한 해당 영화 개봉년도만 가져와서
  //+-2 한 범위의 영화만 필터링했다 (네이버영화에서 22년개봉도 20년이라 뜨는게 있어서 그냥 +-2함)
  //즉, +-2의 범위 밖의 영화는 가져오지 않는 것이다
  //영진회에서 가리키는 현재 박스오피스의 영화 와
  //네이버에서 영진회제목+장르 이게 서로 최대한 일치하도록 진행하는 것이다
  const filterTitle = (arr, query, openDt) => {
    openDt = openDt.split('-').slice(0, 1)[0]

    if (arr.length === 1) {
      //1개의 결과만 나와도 이게 잘못된 것이 나올 수 있기 때문에
      //Home과는 다르게 얘는 연도로 필터링을 또 해줘야 한다

      //영진회에서 제공한 연도+-2 필터링
      arr = arr.filter((i) => {
        return (
          Number(i.pubDate) >= openDt - 2 && Number(i.pubDate) <= openDt + 2
        )
      })

      return arr[0]
    } else {
      arr = arr.map((i) => {
        return {
          ...i,
          title: i.title.split('<b>').join('').split('</b>').join(''),
        }
      })
      arr = arr.filter((i) => {
        //공백을 죄다 제거하고 비교
        return i.title.replace(/(\s*)/g, '') === query.replace(/(\s*)/g, '')
      })

      //근데 위에서도 제목이 같이 않는다면 arr은 남는게 없다
      //그래서 어쩔 수 없이 빈 문자열로 리턴
      if (!arr.length) {
        return ''
      }

      if (arr.length !== 1) {
        ///가장 원시적인 max값을 탐색. 우선 맨 앞의 값을 최댓값으로 넣어줌
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

        //console.log(arr)

        //영진회에서 제공한 연도+-2 필터링
        arr = arr.filter((i) => {
          console.log(i.pubDate)
          return (
            Number(i.pubDate) >= openDt - 2 && Number(i.pubDate) <= openDt + 2
          )
        })
      }

      return arr[0]
    }
  }

  return (
    <>
    {naverInfo.length? <Navbar expand="sm" style={{ height: '200px'}} >
        <Container fluid>
          <Navbar.Brand href="#recommand">이 영화는 어떠신가요?</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            {naverInfo.length && (
              <div>
                {naverInfo.map((i, index) => {
                  if(index>=3){
                    return
                  }
                  else{
                  return (
                    <Nav
                      className="me-auto my-2 my-lg-0"
                      style={{ maxHeight: '200px' }}
                      navbarScroll
                    >
                      <NavDropdown
                        title={i.kofic.movieNm}
                        id="navbarScrollingDropdown"
                      >
                        <NavDropdown.Item>
                          현재 {i.kofic.rank}위
                        </NavDropdown.Item>
                        <NavDropdown.Item style={{ height: '200px' }}>
                          <img src={i.naver.image} alt="img" />
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          개봉일 {i.kofic.openDt}
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          누적 관객 수
                          {i.kofic.audiAcc.replace(
                            /(\d)(?=(?:\d{3})+(?!\d))/g,
                            '$1,',
                          )}
                          명
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          네이버 평점 {i.naver.userRating}
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          {' '}
                          출연{' '}
                          {i.naver.actor.length > 10
                            ? `${i.naver.actor.slice(0, 10)}...`
                            : i.naver.actor}
                        </NavDropdown.Item>

                        <NavDropdown.Divider />
                      </NavDropdown>
                    </Nav>
                  )
                          }
                })}
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>:
        ''
      }
      
    </>
  )
}

export default Recommand
