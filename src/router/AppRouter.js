import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
  } from 'react-router-dom'
import Auth from '../components/Main/Auth'
import Detail from '../components/Movie/Detail'
import Home from '../components/Movie/Home'
import Join from '../components/Main/Join'
import MainSelect from '../components/Main/MainSelect'
import Profile from '../components/Profile'
import Navigation from './Navigation'


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


            <Route path='/social' element={<></>}></Route>
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
