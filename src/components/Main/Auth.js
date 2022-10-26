import { authService } from '../../fbase'
import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

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

  const Card = styled.div`
    width: 600px;
    padding: 500px 70px 50px 50px;
    border: 1px solid gray;
    border-radius: 20px;
  `

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
      <Container>
        {/* styled-components로 bootstrap이 적용된 요소를 감싸버린다 */}

        {/* 패딩을 늘리면 어쩔 수 없이 width로 정해진 너비는 한정적이므로
        안에 버튼 크기들이 작아진다 */}
        <Card>
          <Stack gap={4} className="col-md-5 mx-auto">
          <Button
              variant="outline-secondary"
              onClick={onSocialClick}
              name="google"
            >
              Goolge Login
            </Button>
            <Button
              variant="outline-secondary"
              onClick={onSocialClick}
              name="github"
            >
              GitHub Login
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  )
}

export default Auth
