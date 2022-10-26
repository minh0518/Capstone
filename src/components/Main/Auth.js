import { authService } from '../../fbase'
import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import { Link } from 'react-router-dom'

import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import styled from 'styled-components'

const Auth = () => {
  const Container = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  `

  const Card=styled.div`
  border: 1px solid gray;
  `

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
      const data = await signInWithEmailAndPassword(
        authService,
        email,
        password,
      )
    } catch (e) {
      console.log(e.message)
      setError(e.message)
    }
  }

  const onSocialClick = async (e) => {
    const { name, value } = e.target

    let provider

    if (name === 'google') {
      provider = new GoogleAuthProvider()
    } else if (name == 'github') {
      provider = new GithubAuthProvider()
    }

    const data = await signInWithPopup(authService, provider)
    console.log(data)
  }

  return (
    <>
      {/* <form onSubmit={onSubmit}>
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
        <input type="submit" value="Log In" />
        {error}
      </form>

      <b>
        <Link to="/join">회원가입
        </Link>
      </b> */}

      <Container>
        {/* 패딩을 늘리면 어쩔 수 없이 width로 정해진 너비는 한정적이므로
        안에 버튼 크기들이 작아진다 */}
        <div style={{ width: '600px' , padding:'500px 70px 50px 50px', border: '1px solid gray' , borderRadius:'20px'}}>
          <Stack gap={4} className="col-md-5 mx-auto">
            <Button
              variant="outline-secondary"
              onClick={onSocialClick}
              name="github"
            >
              GitHub Login
            </Button>
            <Button
              variant="outline-secondary"
              onClick={onSocialClick}
              name="google"
            >
              Goolge Login
            </Button>
          </Stack>
        </div>
      </Container>

      {/* <div>
          <button onClick={onSocialClick} name="google">
            Goolge Login
          </button>
        </div>
        <div>
          <button onClick={onSocialClick} name="github">
            GitHub Login
          </button>
        </div> */}
    </>
  )
}

export default Auth
