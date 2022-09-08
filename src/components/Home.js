import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CATEGORIES from '../categories'

const Home = () => {
  const [koficInfo, setKoficInfo] = useState([])
  const [naverInfo, setNaverInfo] = useState([])
  const [nationCategory, setNationCategories] = useState('')
  const [multiCategory, setMultiCategorie] = useState('')

  const styleObj = {
    display: 'flex',
    listStyle: 'none',
  }


  const makeDate=()=>{

    let today = new Date()
    let year = today.getFullYear() // 년도
    let month = (''+(today.getMonth() + 1)).length===1 ? '0'+(today.getMonth() + 1) :today.getMonth() + 1 // 월
    let date = (''+(today.getDate()-1)).length===1? '0'+(today.getDate()-1):''+today.getDate()-1// 날짜
  
    return [year,month,date].join('')
  }

  //영화진흥위원회 정보
  useEffect(() => {
    const getMovies = async () => {
      try {
        const nationQuery = nationCategory
          ? `&repNationCd=${nationCategory}`
          : ''
        const multiQuery = multiCategory ? `&multiMovieYn=${multiCategory}` : ''

        const date=makeDate()
        console.log(date)
        let response = await axios.get(
          `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=a5ff207b0075a51ed12c42d6c4b67218&targetDt=${date}${nationQuery}${multiQuery}`,
        )
        
        console.log(nationQuery)

        let list = response.data.boxOfficeResult.dailyBoxOfficeList
        setKoficInfo(list)
      } catch (e) {
        console.log(e)
      }
    }
    getMovies()
  }, [nationCategory, multiCategory])

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
            display: 3,
          },
          headers: {
            'X-Naver-Client-Id': ID_KEY,
            'X-Naver-Client-Secret': SECRET_KEY,
          },
        })

        //kofic은 영화진흥위원회 정보 , naver는 네이버영화 정보
        NaverInfoArr.push({
          kofic: koficInfo[i],
          naver: response.data.items.shift(),
        })
      }

      //console.log(tmp)
      setNaverInfo(NaverInfoArr)
    }
    getMovies()
  }, [koficInfo])

  console.log(naverInfo)

  return (
    <div>
      <h1>Select Movie</h1>

      <ul style={styleObj}>
        {(CATEGORIES.nationCategories).map((i, index) => {
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
        {(CATEGORIES.multiCategories).map((i, index) => {
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
            <div key={index} style={{ padding: '20px' }}>
              <img src={i.naver.image} alt="img" />
              <p key={index}>{i.kofic.movieNm}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home
