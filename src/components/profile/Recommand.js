import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Recommand = ({ preferredGenre }) => {
  const [koficInfo, setKoficInfo] = useState([])
  const [naverInfo, setNaverInfo] = useState([])

  const genre = {
    ALL: '',
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
  }, [preferredGenre])

  let NaverInfoArr = []

  console.log(naverInfo)

  //네이버영화 정보
  useEffect(() => {
    const getMovies = async () => {
      const ID_KEY = '7ZKljEdHUmg5R3Ny2sr3'
      const SECRET_KEY = 'Fk9VkXWZjQ'

      console.log(genre[preferredGenre])
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

        //장르에 없는 것들은 제외하고 받음
        //네이버의 리턴값이 배열로 된 형태라 값이 없는지 확인하기 위해 .length 사용
        if (response.data.items.length) {
          NaverInfoArr.push({
            kofic: koficInfo[i],
            naver: response.data.items.shift(),
          })
        }
      }
      setNaverInfo(NaverInfoArr)
    }
    getMovies()
  }, [koficInfo])

  return (
    <>
      {naverInfo.length && (
        <div>
          {naverInfo.map((i, index) => {
            return (
              <div key={index} style={{ padding: '20px', paddingTop: '0px' }}>
                <h4>현재 {i.kofic.rank}위</h4>
                <img src={i.naver.image} alt="img" />
                <p style={{ height: '50px' }}>{i.kofic.movieNm}</p>
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
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default Recommand
