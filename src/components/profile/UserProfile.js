import { getDocs, addDoc, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dbService } from '../../fbase'

const UserProfile = ({ userObj }) => {
  const { id } = useParams()

  const [profile, setProfile] = useState({
    displayName: '',
    uid: '',
    birth: '',
    preferredGenre: '',
    bestPick: [],
    photoURL: '',
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

  console.log(profile)

  return (
    <div>
      <img
        src={profile.photoURL?profile.photoURL:''}
        style={{ width: '50px', height: '50px' }}
        alt="profileImg"
      />

      <h3>{profile.displayName}</h3>

      <br />

      <div>
        닉네임 :{profile.displayName}

      </div>

      <div>
        생년월일 :{profile.birth}
      </div>

      <div>
        관심 장르 :{profile.preferredGenre}
       
      </div>

      <div>
        Best Pick! {profile.bestPick}
      </div>
    </div>
  )
}

export default UserProfile
