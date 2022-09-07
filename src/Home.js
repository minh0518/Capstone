import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Home = () => {
  const [koficInfo, setkoficInfo] = useState([])
  const [naverInfo, setNaverInfo] = useState([])
  
  //영화진흥위원회 정보
  useEffect(() => {
    const getMovies = async () => {
      try {
        let response = await axios.get(
          'http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=a5ff207b0075a51ed12c42d6c4b67218&targetDt=20220905',
        )

        let list = response.data.boxOfficeResult.dailyBoxOfficeList
        setkoficInfo(list)
      } catch (e) {
        console.log(e)
      }
    }
    getMovies()
  }, [])

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
        NaverInfoArr.push({kofic:koficInfo[i], naver:response.data.items.shift()})
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

      {naverInfo.map((i, index) => {
        return (
          <div key={index}>
          <img src={i.naver.image} alt='img'/>
          <p key={index}>{i.kofic.movieNm}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Home
