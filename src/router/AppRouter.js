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
import MyProfile from '../components/profile/MyProfile'
import Navigation from './Navigation'
import Social from '../components/social/Social'
import Post from '../components/social/Post'
import Chat from '../components/chats/Chat'
import ChatList from '../components/chats/ChatList'
import EditProfileImg from '../components/profile/EditProfileImg'
import UserProfile from '../components/profile/UserProfile'
import { Container } from '../styles/Container.styled'
import UsersPickMovie from '../components/profile/UsersPickMovie'


const AppRouter = ({ isLoggedIn ,userObj }) => {
  return (
    <Router>
  {isLoggedIn && <Navigation userObj={userObj}/>} 

    <Container>
      <Routes>
        {isLoggedIn ? ( //로그인 됐을 때
          <>
            <Route path="/" element={<MainSelect/>}></Route>
            <Route path="/movie" element={<Home/>}></Route>
            <Route path="/myProfile" element={<MyProfile userObj={userObj}/> } ></Route>
            <Route path="/myProfile/editProfileImg" element={<EditProfileImg userObj={userObj}/>}></Route>
            <Route path="/userProfile/:id" element={<UserProfile userObj={userObj}/>}></Route>
            <Route path="/userProfile/:id/:movieName" element={<UsersPickMovie userObj={userObj}/>}></Route>
            <Route path='/movie/detail/:id' element={<Detail userObj={userObj}/>}></Route>
            <Route path='/social' element={<Social userObj={userObj}/>}></Route>
            <Route path='/social/post/:documentId' element={<Post userObj={userObj}/>}></Route>
            <Route path='/chatList' element={<ChatList userObj={userObj}/>}></Route>
            <Route path='/chatList/chat/:id' element={<Chat userObj={userObj}/>}></Route>
          </>
        ) : ( //로그인 안 됐을 때
          <>
          <Route path="/" element={<Auth />}></Route>
          <Route path="/join" element={<Join />}></Route>
          </>
        )}
      </Routes>
      </Container>
    </Router>
    
  )
}

export default AppRouter
