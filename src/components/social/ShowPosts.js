import { getDocs, addDoc, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dbService } from '../../fbase'

const ShowPosts = ({ movieTitle, theater, region }) => {
  const [allPost, setAllPost] = useState([])

  const [categorizedPosts, setCategorizedPosts] = useState(allPost)

  const [categories, setCategories] = useState({
    movieTitle: 'ALL',
    theater: 'ALL',
    region: 'ALL',
  })

  useEffect(() => {
    const getPosts = async () => {
      const dbPosts = await getDocs(collection(dbService, 'posts'))
      dbPosts.forEach((i) => {
        let obj = {
          ...i.data(),
          id: i.id, //문서아이디 자동생성된거 가져오기
        }
        setAllPost((prev) => [...prev, obj])
        setCategorizedPosts((prev) => [...prev, obj])
        //맨 처음에는 선택이 안 되어 있으니까 전부다 받아와야 한다
      })
    }
    getPosts()
  }, [])

  console.log(categorizedPosts)
  const onChange = (e) => {
    const { name, value } = e.target

    //카테고리가 바뀔 때마다
    //기존 목록에서 추가로 필터링을해서 상태업데이트를 해줘야하는데
    //솔직히 임시Arr배열 안쓰고 바로 setCategorizedPosts를 사용하려 했는데
    //최적화된 알고리즘이 떠오르지 않는다...
    if (name === 'title') {
      setCategories({
        ...categories,
        movieTitle: value,
      })
      //여기서는 비동기처리가 상관이 없는게
      //movieTitle카테고리가 바뀌었으면 setCategories를 업뎃하는데
      //movieTitle을 제외한 region,theater같은 것들은
      //어차피 categories상태의 값을 그대로 사용하면 되고

      //그리고 아래에서는 setCategories의 movieTitle말고
      //e.target.value를 사용하기 때문에 실시간으로 변한 값으로 사용할
      //수 있는 것이다

      //그리고 이 로직이 끝나게 되면 비로소 setCategories로
      //현재 선택된 movieTitle도 업뎃이 되는 것이다

      let titleArr = []
      //titleArr는 ALL이 선택된 경우
      //OR
      //특정 값으로 선택된 경우
      //에 따라 처리가 된다

      //제목이 all이면 지역과 영화관만 가지고 수정하면 된다
      if (value === 'ALL') {
        //반드시 전체 내용들에서 map을 돌려야 한다
        allPost.map((i) => {
          //제목이 all이고
          //영화관도 all , 지역은 선택된 값이 있을 때
          if (categories.theater === 'ALL' && categories.region !== 'ALL') {
            //all이 아닌 것도 반드시 체크해야한다
            //안하면 theater가 ALL이면 무조건 이 조건이
            //실행되고 나머지는 if/else체이닝이라
            //아예 실행이 안된다

            //지역기반으로만 추출
            if (categories.region === i.region) {
              titleArr.push(i)
            }
          }
          //제목이 all이고
          //지역도 all , 영화관은 선택된 값이 있을 때
          else if (
            categories.region === 'ALL' &&
            categories.theater !== 'ALL'
          ) {
            //영화관 기반으로 추출
            if (categories.theater === i.theater) {
              titleArr.push(i)
            }
          }

          //제목이 all이고
          //지역도 all , 영화도all
          else if (
            categories.theater === 'ALL' &&
            categories.region === 'ALL'
          ) {
            //allPost전부 다
            titleArr.push(i)
          }

          //제목,지역,영화 전부 다 선택되어 있을 때
          else {
            if (
              categories.theater === i.theater &&
              categories.region === i.region
            ) {
              titleArr.push(i)
            }
          }
        })
      }

      //제목 카테고리가 all이 아니라
      //특정 값으로 설정되었을 때
      else {
        //반드시 categorizedPosts기반으로 추출해야 한다
        categorizedPosts.map((i) => {
          if (i.movieTitle === value) {
            titleArr.push(i)
          }
        })
      }

      //위에서 필터링한 조건으로 생성된 titleArr로 상태변경
      setCategorizedPosts(titleArr)
    }

    if (name === 'theater') {
      setCategories({
        ...categories,
        theater: value,
      })

      let theaterArr = []

      if (value === 'ALL') {
        allPost.map((i) => {
          if (categories.region === 'ALL' && categories.movieTitle !== 'ALL') {
            if (categories.movieTitle === i.movieTitle) {
              theaterArr.push(i)
            }
          } else if (
            categories.movieTitle === 'ALL' &&
            categories.region !== 'ALL'
          ) {
            if (categories.region === i.region) {
              theaterArr.push(i)
            }
          } else if (
            categories.movieTitle === 'ALL' &&
            categories.region === 'ALL'
          ) {
            theaterArr.push(i)
          } else {
            if (
              categories.movieTitle === i.movieTitle &&
              categories.region === i.region
            ) {
              theaterArr.push(i)
            }
          }
        })
      } else {
        categorizedPosts.map((i) => {
          if (i.theater === value) {
            theaterArr.push(i)
          }
        })
      }
      setCategorizedPosts(theaterArr)
    }

    if (name === 'region') {
      setCategories({
        ...categories,
        region: value,
      })

      let regionArr = []

      if (value === 'ALL') {
        allPost.map((i) => {
          if (categories.theater === 'ALL' && categories.movieTitle !== 'ALL') {
            if (categories.movieTitle === i.movieTitle) {
              regionArr.push(i)
            }
          } else if (
            categories.movieTitle === 'ALL' &&
            categories.theater !== 'ALL'
          ) {
            if (categories.theater === i.theater) {
              regionArr.push(i)
            }
          } else if (
            categories.theater === 'ALL' &&
            categories.movieTitle === 'ALL'
          ) {
            regionArr.push(i)
          } else {
            if (
              categories.theater === i.theater &&
              categories.movieTitle === i.movieTitle
            ) {
              regionArr.push(i)
            }
          }
        })
      } else {
        categorizedPosts.map((i) => {
          if (i.region === value) {
            regionArr.push(i)
          }
        })
      }

      setCategorizedPosts(regionArr)
    }
  }

  const styleObj = {
    display: 'flex',
    alignItems: 'center',
  }

  const styleObj2 = {
    flex: '1',
  }

  const styleObj3 = {
    display: 'flex',
    justifyContent: 'center',
  }
  return (
    <div>
      <label htmlFor="title">영화 제목 :</label>
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
      <br />
      <label htmlFor="region">지역(구) : </label>
      <select id="region" name="region" onChange={onChange}>
        <option value="default" disabled>
          지역(구)을 선택하세요
        </option>
        {region.map((i, index) => {
          return (
            <option key={index} value={i}>
              {i}
            </option>
          )
        })}
      </select>

      <div style={styleObj3}>
        <div style={{ width: '600px' }}>
          {categorizedPosts.map((i) => {
            return (
              <>
                <div style={styleObj}>
                  <div style={styleObj2}>
                    <h4>{i.userName}</h4>
                  </div>
                  <div>{i.time}</div>
                </div>
                <Link
                  style={{ textDecoration: 'none', color: 'black' }}
                  to={`/social/post/${i.id}`} //documentId를 사용
                >
                  <strong>{i.postTitle}</strong>
                </Link>
                <hr />
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ShowPosts
