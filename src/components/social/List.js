import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const List = () => {
  const [movieTitle, setMovieTitle] = useState(['ALL'])

  const [theater, setTheater] = useState([
    'ALL',
    'CGV',
    'MEGABOX',
    'LOTTECINEMA',
    'ETC',
  ])
  //const [region, setRegion] = useState([])

  const [selectedTitle, setSelectedTitle] = useState('')
  const [selectedTheater, setSelectedTheater] = useState('')
  //const [selectedRegion, setselectedRegion] = useState('')

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

        list.map((i) => {
          setMovieTitle((prev) => [...prev, i.movieNm])
          //처음나오는 영화일수록 순위가 높으므로 prev를 앞에 넣어야 함
        })
      } catch (e) {
        console.log(e)
      }
    }
    getMovies()
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target

    if (name === 'title') {
      setSelectedTitle(value)
    }
    if (name === 'theater') {
      setSelectedTheater(value)
    }
  }

  return (
    <div>
      <label htmlFor="title">영화 :</label>
      <select id="title" name="title" onChange={onChange}>
        <option value="default" disabled>
          영화를 선택하세요
        </option>
        {movieTitle.map((i, index) => {
          return (
            <option key={index} value={i}>
              {i}
            </option>
          )
        })}
      </select>
      <br />
      <label htmlFor="theater">영화관 :</label>
      <select id="theater" name="theater" onChange={onChange}>
        <option value="default" disabled>
          영화관을 선택하세요
        </option>
        {theater.map((i, index) => {
          return (
            <option key={index} value={i}>
              {i}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default List
