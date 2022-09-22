import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'

const MainSelect = () => {
  const styleObj = {
    display:'flex',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  }


  return (
    <div style={styleObj}>
      <h1>
      <Link to="/movie" style={{textDecoration:'none'}}>
        Movie
      </Link>
      </h1>
      &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <h1>
      <Link to="/social" style={{textDecoration:'none'}}>Social</Link>
      </h1>
    </div>
  )
}

export default MainSelect
