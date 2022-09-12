import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
  } from 'react-router-dom'
import Auth from '../components/Auth'
import Detail from '../components/Detail'
import Home from '../components/Home'
import Join from '../components/Join'
import MainSelect from '../components/MainSelect'
import Profile from '../components/Profile'
import Reviews from '../components/Reviews'
import Navigation from './Navigation'


const AppRouter = ({ isLoggedIn ,setMovieInfo,movieInfo }) => {
  return (
    <Router>
  {isLoggedIn && <Navigation/>} 

      <Routes>
        {isLoggedIn ? ( //로그인 됐을 때
          <>
            <Route path="/" element={<MainSelect/>}></Route>
            <Route path="/moive" element={<Home setMovieInfo={setMovieInfo}/>}></Route>
            <Route path="/profile" element={<Profile/>}></Route>
            <Route path='/movie/detail/:id' element={<Detail movieInfo={movieInfo}/>}></Route>
            <Route path='/movie/detail/:id/reviews' element={<Reviews movieInfo={movieInfo}/>}></Route>


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
