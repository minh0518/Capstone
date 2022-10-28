import React, { useState } from 'react'
import { dbService } from '../../fbase'
import { addDoc, collection } from 'firebase/firestore'
import { Select } from '../../styles/Container.styled'

const WritePost = ({ movieTitle, theater, region, userObj }) => {
  console.log(userObj)

  const [post, setPost] = useState({
    postTitle: '',
    context: '',
    movieTitle: 'ALL',
    theater: 'ALL',
    region: 'ALL',
    userName: userObj.displayName,
    userId: userObj.uid,
    userImg: userObj.photoURL,
  })

  const onChange = (e) => {
    const { name, value } = e.target

    if (name === 'postTitle') {
      setPost({
        ...post,
        postTitle: value,
      })
    }
    if (name === 'movieTitle') {
      setPost({
        ...post,
        movieTitle: value,
      })
    }
    if (name === 'theater') {
      setPost({
        ...post,
        theater: value,
      })
    }

    if (name === 'region') {
      setPost({
        ...post,
        region: value,
      })
    }

    if (name === 'context') {
      setPost({
        ...post,
        context: value,
      })
    }
  }

  const onSubmit = async (e) => {
    //등록을 하고 자동으로 새로고침을 해주기 위해서
    // e.preventDefault()를 사용하지 않음
    //으로 하려 했는데 그러면 부분적으로 안되는 경우가 생김
    //이유는 모르겠으나 추측컨데, firebase에 등록이 되기도 전에
    //새로고침이 먼저 되어서?

    e.preventDefault()

    const doc = await addDoc(collection(dbService, 'posts'), {
      ...post,
      time: new Date().toLocaleString(),
    })

    // console.log(post)

    // setPost({
    //   postTitle: '',
    //   context: '',
    //   movieTitle: 'ALL',
    //   theater: 'ALL',
    //   region: 'ALL',
    //   userName: userObj.displayName,
    //   userId: userObj.uid,
    // })
    //이걸 사용하면 다음 등록할때 movieTitle,region,theater전부다 직접
    //선택하지 않으면
    //값이 여기서 설정해준 빈 문자열로 들어가게 된다
    //패이지를 새로고침하는 다른 방법을 써야 할듯?

    window.alert('등록이 완료 되었습니다!')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '40px' }}>
      <div>
        <form onSubmit={onSubmit}>
          <label htmlFor="movieTitle">영화 제목</label>
          <Select
            style={{ margin: '10px', display: 'block' }}
            id="movieTitle"
            name="movieTitle"
            onChange={onChange}
          >
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
          </Select>
          <br />
          <label htmlFor="theater">영화관</label>
          <Select
            style={{ margin: '10px', display: 'block' }}
            id="theater"
            name="theater"
            onChange={onChange}
          >
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
          </Select>
          <br />
          <label htmlFor="region">지역(구)</label>
          <Select
            style={{ margin: '10px', display: 'block' }}
            id="region"
            name="region"
            onChange={onChange}
          >
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
          </Select>
          <br />
          <br />
          <label htmlFor="postTitle">글 제목</label>
          <input
            style={{
              margin: '10px',
              display: 'block',
              width: '300px',
              border: '2px solid',
              borderRadius: '4px',
            }}
            id="postTitle"
            name="postTitle"
            onChange={onChange}
            value={post.PostTitle}
          ></input>
          <br />
          <br />
          <textarea
            id="context"
            name="context"
            style={{
              width: '100%',
              height: '200px',
              border: '2px solid',
              borderRadius: '4px',
            }}
            onChange={onChange}
          />
          <br />
          <br />
          <input type="submit" value="등록"></input>
        </form>
      </div>
    </div>
  )
}

export default WritePost
