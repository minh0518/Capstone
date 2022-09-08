import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
  } from 'react-router-dom'
import Auth from '../components/Auth'
import Home from '../components/Home'
import Profile from '../components/Profile'
import Navigation from './Navigation'


const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
  {isLoggedIn && <Navigation/>} 

      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile/>}></Route>
            <Route></Route>
          </>
        ) : (
          <Route path="/" element={<Auth />}></Route>
        )}
      </Routes>
    </Router>
  )
}

export default AppRouter
