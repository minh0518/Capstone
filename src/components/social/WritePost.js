import React, { useState } from 'react'
import { dbService } from '../../fbase'
import { addDoc, collection } from 'firebase/firestore'

const Post = ({ movieTitle, theater, region, userObj }) => {


  const [selectedTitle, setSelectedTitle] = useState('')
  const [selectedTheater, setSelectedTheater] = useState('')

  const [post, setPost] = useState({
    context: '',
    movieTitle: '',
    theater: '',
    region: '',
    userName: userObj.displayName,
    userId: userObj.uid,
  })

  const onChange = (e) => {
    const { name, value } = e.target

    if (name === 'title') {
      setSelectedTitle(value)
      setPost({
        ...post,
        movieTitle: value, //value대신 selectedTitle를 하면 비동기처리때문에 꼬임
                          //즉, 반영이 안됨
      })
    }
    if (name === 'theater') {
      setSelectedTheater(value)
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


    console.log('did it work?')
    const doc = await addDoc(collection(dbService, 'posts'), {
      ...post,
      time: new Date().toLocaleString(),
    })
    setPost({
      context: '',
      movieTitle: '',
      theater: '',
      region: '',
      userName: userObj.displayName,
      userId: userObj.uid,
    })

    console.log('yes')

    window.alert('등록이 완료 되었습니다!')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
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
        <br />
        <br />
        <textarea
          id="context"
          name="context"
          style={{ width: '300px', height: '150px' }}
          onChange={onChange}
        />
        <br />
        <br />
        <input type="submit" value="등록"></input>
      </form>
    </div>
  )
}

export default Post
