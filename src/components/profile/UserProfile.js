// 내 프로필 말고 다른 사람의 프로필을 방문했을 때 보여지는 페이지입니다
// 당연히 여기서는 수정 및 삭제가 되지 않으며
// 내 프로필과 마찬가지로 그 사람의 프로필에 대해서 정보들을 보여주게 되며
// 내 프로필과 차이점은 다른 유저가 설정해 놓은 BestPick 영화들을 클릭하게 될 시,
// 그 영화 목록들을 띄워주며 (같은 영화제목이 있을 수 있으니까 우선 여러개 보여줍니다)
// 실제 네이버 영화정보로 이동하게 할 수 있게 됩니다


//여기 또한 영화 진흥위원화가 리턴해주는 제목과 네이버api에서 찾아오는 영화들의 차이가 존재하므로
//네이버api가 리턴하는 것들을 받아서 보다 더 정확한 영화들을 보여주기 위해 
//따로 문자열 필터링 알고리즘을 적용해서 영화들을 보여주도록 했습니다
//(Home페이지에서 사용한 것과 살짝 다른 필터링 로직입니다)



import { getDocs, addDoc, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dbService } from '../../fbase'
import Recommand from './Recommand'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { ProfileBox } from '../../styles/Container.styled'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import ShowLocation from '../map/ShowLocation'
import UsersPickMovie from './UsersPickMovie'

const UserProfile = ({ userObj }) => {
  const { id } = useParams()

  const [profile, setProfile] = useState({
    displayName: '',
    uid: '',
    birth: '',
    preferredGenre: '',
    bestPick: [],
    photoURL: '',
    favoriteTheater: '',
  })

  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  useEffect(() => {
    const getProfiles = async () => {
      const dbProfile = await getDocs(collection(dbService, 'profiles'))

      dbProfile.forEach((i) => {
        if (i.data().uid === id) {
          setProfile(i.data())
        }
      })
    }
    getProfiles()
  }, [])

  return (
    <div>
      <h2 className="profilePont">{`${profile.displayName}'s Profile`}</h2>
      <br />
      <br />
      <Container>
        <Row xs={12} md={12} lg={12}>
          <Col>
            <ProfileBox>
              <div
                style={{
                  borderRight: '1px solid black',
                  paddingRight: '50px',
                  marginRight: '50px',
                }}
              >
                <img
                  src={profile.photoURL}
                  style={{
                    width: '330px',
                    height: '400px',
                    borderRadius: '20px',
                  }}
                  alt=""
                />
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5>
                    <b>{profile.displayName}</b>
                  </h5>
                  생년월일 :<>{profile.birth}</>
                </ListGroup.Item>
                <ListGroup.Item>
                  관심 장르 :<> {profile.preferredGenre}</>
                </ListGroup.Item>
                <ListGroup.Item>
                  Best Pick!
                  <p style={{color:'lightgray'}}>클릭해서 자세한 정보를 알아보세요</p>
                  <ul style={{ listStyle: 'none' }}>
                    {profile.bestPick.map((i) => {
                      return <UsersPickMovie userObj={userObj} movieName={i} />
                    })}
                  </ul>
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>자주 가는 영화관</b>
                  {profile.favoriteTheater ? (
                    //  profile.favoriteTheater가 있을 경우에만 지도로 보여줌
                    <>
                      <ShowLocation placeName={profile.favoriteTheater} />
                      <h5>
                        <b>{profile.favoriteTheater}</b>
                      </h5>
                    </>
                  ) : (
                    '아직 선택되지 않았습니다'
                  )}
                </ListGroup.Item>
              </ListGroup>
            </ProfileBox>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default UserProfile
