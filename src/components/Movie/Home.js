//처음 MainSelect에서 BoxOffice를 선택했을때 보여지는 페이지입니다
//2개의 api를 조합 및 문자열 처리 알고리즘을 통해 
//카테고리를 선택할 수있으며 카테고리별로 박스오피스 순위 와 간략한 정보들 ,
//그리고 보다 더 자세한 정보와 리뷰가 있는 Detail페이지로 이동할 수 있습니다

//세션스토리지를 사용해서 다른 페이지에서 ( Detail페이지 ) 에서 이 api정보를 받아서
// 끊김없이 (기존의 방식애로 그냥 props로 넘겨주면 새로고침하면 바로 에러가 발생) 
//서비스를 이용할 수 있도록 했습니다

import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CATEGORIES from '../../categories'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import '../../styles/home.scss'
import { Box } from '../../styles/Container.styled'
import Spinner from 'react-bootstrap/Spinner'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Offcanvas from 'react-bootstrap/Offcanvas'

import styled from 'styled-components'
import MovieCompanyInfo from './MovieCompanyInfo'

const Home = () => {
  const [koficInfo, setKoficInfo] = useState([])
  const [naverInfo, setNaverInfo] = useState([])
  const [nationCategory, setNationCategories] = useState('')
  const [multiCategory, setMultiCategorie] = useState('')

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
            display: 20,
            //최소한 20개는 받아와야 그 중에서 정확한 영화가 하는 포함되어있다
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
        //존재한다 (이상한 영화까지 다 받아지는게 아니라 아예 리턴값이 없는 것이다)
        //그래서 이럴땐 어쩔 수 없이 빈 문자열을 리턴
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

      sessionStorage.setItem('movies', JSON.stringify(NaverInfoArr))

      setNaverInfo(NaverInfoArr)
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
      //(이렇게 해도 되고 사실 <b></b>안에 있는값만 추출해서 제목과 완전히 같은지 비교해도 됨)
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
      //이건진짜 최종적으로 어쩔 수 없이 에러를 넘겨야 하는 상황이므로
      //빈 문자열로 리턴
      if (!arr.length) {
        return ''
      }

      //그런데도 같은 제목의 영화가 존재할 수 있음
      //그래서 위의 필터링을 거쳤는데도 여러개가 아직 남아 있다면
      //개봉연도 중에서 가장 최근인 것으로 추출
      //(근데 재개봉한 영화는 이 로직이 먹히질 않는다....)
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

  const settings = {
    className: 'center',
    centerMode: true, //중앙모드?
    infinite: false,
    centerPadding: '150px', //크기를 늘리면 요소 사이의 간격이 줄어듦 ,  0px 하면 슬라이드 끝쪽 이미지가 안잘림?
    slidesToShow: 3,
    speed: 500,
    dots: true, // 슬라이드 밑에 점 보이게
  }

  //커스텀
  const StyledSlider = styled(Slider)`
    // height: 90%; //슬라이드 컨테이너 영역

    .slick-list {
      //슬라이드 스크린
      width: 100%;
      height: 350px;
      margin-top: 150px;
      overflow-x: hidden;
    }

    .slick-slide div {
      //슬라이더  컨텐츠
    }

    .slick-dots {
      //슬라이드의 위치
    }
  `

  return (
    <div>
      <h2 className="boxOfficePont">Box Office</h2>

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

      {naverInfo.length ? (
        <StyledSlider {...settings}>
          {naverInfo.map((i, index) => {
            // 빈 문자열 받으면 어쩔 수 없이 공백
            if (i.naver === '') {
              return ''
            } else {
              return (
                <div key={index}>
                  {/* <div style={{width:'200px',height:'270px',backgroundColor:'lightgrey'}}> */}
                  <h5>{index + 1}위</h5>
                  <Link
                    variant="primary"
                    to={`/movie/detail/${index + 1}`}
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <img
                      src={i.naver.image}
                      alt="MovieImg"
                      style={{ marginBottom: '20px' }}
                    ></img>
                    <h4>
                      {i.kofic.movieNm.length > 10
                        ? `${i.kofic.movieNm.slice(0, 10)}...`
                        : i.kofic.movieNm}
                    </h4>
                  </Link>
                  <MovieCompanyInfo movieCd={i.kofic.movieCd} index={index} />
                  {/* <button onClick={setChowCompanyInfo(prev=>!prev)}>Made by.</button>
                  {showCompanyInfo&&<MovieCompanyInfo />} */}
                </div>
              )
            }
          })}
        </StyledSlider>
      ) : (
        <div className="loading">
          <Spinner animation="border" />
        </div>
      )}
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
