import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, getDocs, addDoc, doc } from 'firebase/firestore'
import { dbService } from '../../fbase'
import ShowLocation from '../map/ShowLocation'

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

  const styleObj = {
    display: 'flex',
    justifyContent: 'center',
  }

  return (
    <div style={styleObj}>
      <div style={{ width: '500px' }}>
        <div
          style={{ display: 'flex', marginTop: '50px', marginBottom: '50px' }}
        >
          <div style={{ flex: 1 }}>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/userProfile/${post.userId}`}
            >
              <h4>{post.userName}</h4>
            </Link>
            <img src={post.userImg} width="50px" height="50px" alt="img" />
          </div>
          <div>
            {post.time}
            <div style={{ paddingTop: '10px' }}>
              {userObj.uid === post.userId ? (
                <>
                  <button>삭제하기</button>
                </>
              ) : (
                ''
              )}
            </div>
            {/* specificTheater가 지정된 경우에만 보여줌 */}
            {post.specificTheater ? (
              <>
                <ShowLocation placeName={post.specificTheater} />
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
          <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
            <li>영화 제목 : {post.movieTitle}</li>
            <li>지역 : {post.region}</li>
            <li>영화관 : {post.theater}</li>
          </ul>
        </div>

        <div style={{ marginTop: '100px', marginBottom: '400px' }}>
          {post.context}
        </div>
      </div>
    </div>
  )
}

export default Post
