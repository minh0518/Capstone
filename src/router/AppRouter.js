import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
  } from 'react-router-dom'
import Auth from '../components/main/Auth'
import Detail from '../components/movie/Detail'
import Home from '../components/movie/Home'
import Join from '../components/main/Join'
import MainSelect from '../components/main/MainSelect'
import Profile from '../components/Profile'
import Navigation from './Navigation'
import Social from '../components/social/Social'


const AppRouter = ({ isLoggedIn ,setMovieInfo,movieInfo,userObj }) => {
  return (
    <Router>
  {isLoggedIn && <Navigation/>} 

      <Routes>
        {isLoggedIn ? ( //로그인 됐을 때
          <>
            <Route path="/" element={<MainSelect/>}></Route>
            <Route path="/movie" element={<Home setMovieInfo={setMovieInfo}/>}></Route>
            <Route path="/profile" element={<Profile userObj={userObj}/>}></Route>
            <Route path='/movie/detail/:id' element={<Detail movieInfo={movieInfo} userObj={userObj}/>}></Route>
            <Route path='/social' element={<Social />}></Route>
          </>
        ) : ( //로그인 안 됐을 때
          <>
          <Route path="/" element={<Auth />}></Route>
          <Route path="/join" element={<Join />}></Route>
          </>
        )}
      </Routes>
    </Router>
  )
}

export default AppRouter
