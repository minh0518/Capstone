import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
  } from 'react-router-dom'
import Auth from './Auth'
import Home from './Home'
import Navigation from './Navigation'
import Profile from './Profile'

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
