//로그인 후 가장 먼저 보여지는 메인페이지입니다
//이 웹 프로젝트에서 가장 큰 기능인 BoxOffice나 Social 기능 둘 중 하나를 선택하는 곳입니다

import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
//import {Container} from '../../styles/Container.styled'
import styled from 'styled-components'
import '../../styles/mainSelect.scss'

const MainSelect = () => {
  const Container = styled.div`
    display: flex;
    height: 60%;
    justify-content: center;
    align-items: center;
  `

  return (
    <Container>
      {/* 뭔가 중앙이 안 맞아서 살짝 왼쪽으로 땡김 */}
      <div style={{marginRight:'40px'}}>
        <Link
          className='mainMenuButton'
          to="/movie"
          style={{
            textDecoration: 'none',
            fontSize: '50px',
            color: 'grey',
          }}
        >
          Box Office
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link
          className='mainMenuButton'
          to="/social"
          style={{
            textDecoration: 'none',
            fontSize: '50px',
            color: 'grey',
          }}
        >
          Social
        </Link>
      </div>
    </Container>
  )
}

export default MainSelect