import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Recommand = ({ preferredGenre }) => {
  const [koficInfo, setKoficInfo] = useState([])
  const [naverInfo, setNaverInfo] = useState([])

  const genre = {
    ALL : '',
    드라마: 1,
    로맨스: 5,
    판타지: 6,
    모험: 6,
    공포: 7,
    스릴러: 7,
    코미디: 11,
    가족: 12,
    SF: 19,
    액션: 19,
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
  }, [])

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
            display: 3,
            genre: genre[preferredGenre],
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
  }, [preferredGenre])

  return (
    <>
    

    </>
  )
}

export default Recommand
