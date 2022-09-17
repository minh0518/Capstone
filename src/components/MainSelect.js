import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'

const MainSelect = () => {
  const styleObj = {
    display:'flex',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center'
  }


  return (
    <div style={styleObj}>
      <Link to="/movie" >
        Movie
      </Link>
      |<Link to="/social">Social</Link>
    </div>
  )
}

export default MainSelect
