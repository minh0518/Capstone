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
      <h2 className='profilePont'>{`${profile.displayName}'s Profile`}</h2>
      <br />
      <br />
      <Container>
        <Row xs={12} md={12} lg={12}>
          <Col>
            <ProfileBox>
              <div>
                <Card style={{ width: '30rem' }}>
                  <Card.Img variant="top" src={profile.photoURL} />
                  <Card.Body>
                    <Card.Title>{profile.displayName}</Card.Title>
                    <Card.Text>생년월일 :{profile.birth}</Card.Text>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      관심 장르 :{profile.preferredGenre}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Best Pick!
                      <ul style={{ listStyle: 'none' }}>
                        {profile.bestPick.map((i) => {
                          return (
                            <li>
                              <FontAwesomeIcon
                                icon={faVideo}
                                style={{ paddingRight: '10px' }}
                              />
                              {i}
                            </li>
                          )
                        })}
                      </ul>
                    </ListGroup.Item>
                     <ListGroup.Item>
                      <b>자주 가는 영화관</b>
                      {profile.favoriteTheater ? (
                            <>
                              <ShowLocation
                                placeName={profile.favoriteTheater}
                              />
                              <h5><b>{profile.favoriteTheater}</b></h5>
                            </>
                          ) : (
                            '아직 선택되지 않았습니다'
                          )}
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </div>
            </ProfileBox>
          </Col>
        </Row>
        {/* <Row xs={12} md={12} lg={12}>
          <Col
            xs={{ span: 12, offset: 1 }}
            md={{ span: 12, offset: 2 }}
            lg={{ span: 12, offset: 4 }}
          >
            <Recommand preferredGenre={profile.preferredGenre} />
          </Col>
        </Row> */}
      </Container>
    </div>
  )
}

export default UserProfile
