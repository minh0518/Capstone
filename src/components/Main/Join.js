//새로 회원가입시 사용되는 페이지입니다
//그러나 중간에 로직을 수정함으로써(회원가입 하지 않고 소셜로그인으로 대체) 
//이 페이지는 더이상 사용되지 않습니다

import { authService } from '../../fbase'
import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Join = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const onChange = (e) => {
    const { name, value } = e.target

    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'password') {
      setPassword(value)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await createUserWithEmailAndPassword(
        authService,
        email,
        password,
      )
    } catch (e) {
      console.log(e.message)
      setError(e.message)
    }

    navigate('/')
  }

  return (
    <div>
    <h3>이메일 , 비밀번호 입력</h3>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value="회원가입" />
        {error}
      </form>
    </div>
  )
}

export default Join
