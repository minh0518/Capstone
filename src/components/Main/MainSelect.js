import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
//import {Container} from '../../styles/Container.styled'
import styled from 'styled-components'

const MainSelect = () => {
  const Container = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  `

  return (
    <Container>
      <div>
        <Link
          to="/movie"
          style={{
            textDecoration: 'none',
            fontSize: '50px',
            color: 'grey',
          }}
        >
          Movie
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link
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
