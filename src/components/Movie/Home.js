import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CATEGORIES from '../../categories'
import { Link } from 'react-router-dom'


const Home = ({ setMovieInfo }) => {
  const [koficInfo, setKoficInfo] = useState([])
  const [naverInfo, setNaverInfo] = useState([])
  const [nationCategory, setNationCategories] = useState('')
  const [multiCategory, setMultiCategorie] = useState('')

  const styleObj = {
    display: 'flex',
    listStyle: 'none',
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

        let NaverResult=[]

        //response.data.items에는 네이버API로부터 받은
        //최대 10개의 영화정보가 들어있다
        //이것들을 필터링한 결과값을 NaverResult에 각각 1개씩 담는다
        NaverResult.push(filterTitle(response.data.items, koficInfo[i].movieNm))
        
        
        NaverInfoArr.push({
          kofic: koficInfo[i],
          naver: NaverResult.shift(),
        })
      }

      //console.log(tmp)
      setNaverInfo(NaverInfoArr)
      setMovieInfo(NaverInfoArr) //여기서 카테고리로 만들어진 영화들이 상위(App.js)까지 전달
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

    if (arr.length === 1) { //받아온 것이 1개뿐이면 그걸 그대로 사용
      return arr.shift()
    } else {

      //<b></b>태그 제거 후 제목과 완전히 같은 것만 추출
      arr = arr.map((i) => { 
        return {
          ...i,
          title: i.title.split('<b>').join('').split('</b>').join(''),
        }
      })
      arr = arr.filter((i) => {
        return i.title === query
      })


      //그런데도 같은 제목의 영화가 존재할 수 있음
      //그래서 위의 필터링을 거쳤는데도 여러개가 아직 남아 있다면
      //개봉연도 중에서 가장 최근인 것으로 추출
      if (arr.length !== 1) { //아직 여러개가 남아 있다면
        let mostRecent = arr[0].pubDate
        arr.map((i) => {
          if (i.pubDate > mostRecent) {
            mostRecent = i.pubDate
          }
        })

        arr = arr.filter((i) => {
          return i.pubDate === mostRecent
        })
      }

      return arr.shift()
    }
  }

  return (
    <div>
      <h1>Select Movie</h1>
      <h2>Box Office</h2>
      <ul style={styleObj}>
        {CATEGORIES.nationCategories.map((i, index) => {
          return (
            <li key={index}>
              <button
                onClick={() => {
                  setNationCategories(i.text)
                }}
              >
                {i.name}
              </button>
            </li>
          )
        })}
      </ul>
      <ul style={styleObj}>
        {CATEGORIES.multiCategories.map((i, index) => {
          return (
            <li key={index}>
              <button
                onClick={() => {
                  setMultiCategorie(i.text)
                }}
              >
                {i.name}
              </button>
            </li>
          )
        })}
      </ul>

      <div style={styleObj}>
        {naverInfo.map((i, index) => {
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
                  {i.kofic.audiAcc.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')}
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
        })}
      </div>
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