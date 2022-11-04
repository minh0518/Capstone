import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { dbService } from '../../fbase'
import ShowLocation from '../map/ShowLocation'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button';

const Post = ({ userObj }) => {
  const { documentId } = useParams()

  const [post, setPost] = useState({})

  useEffect(() => {
    const getReviews = async () => {
      const result = await getDoc(doc(dbService, 'posts', `${documentId}`))

      setPost(result.data())
    }

    getReviews()
  }, [])

  const navigate = useNavigate()
  const onDelteClick = async () => {
    const ok = window.confirm('삭제하시겠습니까?')

    if (ok) {
      await deleteDoc(doc(dbService, 'posts', `${documentId}`))
      window.alert('삭제가 완료되었습니다')
      navigate(-1)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '500px' }}>
        <div
          style={{ display: 'flex', marginTop: '50px', marginBottom: '50px' }}
        >
          <div style={{ flex: 1 }}>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/userProfile/${post.userId}`}
            >
              <img
                src={post.userImg}
                width="40px"
                height="40px"
                alt="img"
                style={{ borderRadius: '50px' }}
              />
              <h5>{post.userName}</h5>
            </Link>
          </div>
          <div>
            {post.time}
            <div style={{ paddingTop: '10px' }}>
              {userObj.uid === post.userId ? (
                <>
                 <Button onClick={onDelteClick} variant="light">삭제하기</Button>
                  {/* <button onClick={onDelteClick}>삭제하기</button> */}
                </>
              ) : (
                ''
              )}
            </div>
            {/* specificTheater가 지정된 경우에만 보여줌 */}
            {post.specificTheater ? (
              <>
                <ShowLocation placeName={post.specificTheater} />
                {post.specificTheater}
              </>
            ) : (
              ''
            )}
          </div>
        </div>

        <div style={{ marginTop: '50px', marginBottom: '50px' }}>
          <h2> {post.postTitle}</h2>
        </div>
        <div>
          <ListGroup variant="flush">
            <p>영화 제목</p>
            <ListGroup.Item>{post.movieTitle}</ListGroup.Item>
            <p>지역</p>
            <ListGroup.Item>{post.region}</ListGroup.Item>
            <p>영화관</p>
            <ListGroup.Item>{post.theater}</ListGroup.Item>
          </ListGroup>
        </div>

        <div style={{ marginTop: '100px', marginBottom: '400px' , border:'1px solid black' , borderRadius:'10px' , width: '100%',
              height: '200px'}}>
          {post.context}
        </div>
      </div>
    </div>
  )
}

export default Post
