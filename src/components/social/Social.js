import React, { useState, useEffect } from 'react'
import axios from 'axios'
import WritePost from './WritePost'
import ShowPosts from './ShowPosts'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import '../../styles/social.scss'

const Social = ({ userObj }) => {

  

  const [mode, setMode] = useState('list')

  //Post List 보여줄 기본 카테고리들은 여기서 받아옴
  //그리고 Post나 List에다가 뿌려줌
  const [movieTitle, setMovieTitle] = useState(['ALL'])
  const [theater, setTheater] = useState([
    'ALL',
    'CGV',
    'MEGABOX',
    'LOTTECINEMA',
    'ETC',
  ])
  const [region, setRegion] = useState([
    'ALL',
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구',
    '동대문구',
    '동작구',
    '마포구',
    '서대문구',
    '서초구',
    '성동구',
    '성북구',
    '송파구',
    '양천구',
    '영등포구',
    '용산구',
    '은평구',
    '종로구',
    '중구',
    '중랑구',
  ])

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

  const onClick = (e) => {
    const { name, value } = e.target

    if (name === 'list') {
      setMode('list')
    } else {
      setMode('write')
    }
  }

  return (
    <>
      
        <ButtonGroup className="mb-2" style={{marginTop:'30px'}}>
          <Button id="modeButton" onClick={onClick} name="list">List</Button>
          <Button id="modeButton" onClick={onClick} name="write">Write</Button>
        </ButtonGroup>
      

      {/* 여기에 넘겨주는 영화제목,지역같은 리스트들은
      단지 각 컴포넌트에서 select태그에 들어갈 목록에만 사용됨 */}
      {mode === 'list' ? (
        <ShowPosts
          movieTitle={movieTitle}
          theater={theater}
          region={region}
          userObj={userObj}
        />
      ) : (
        <WritePost
          movieTitle={movieTitle}
          theater={theater}
          region={region}
          userObj={userObj}
        />
      )}
    </>
  )
}

export default Social
