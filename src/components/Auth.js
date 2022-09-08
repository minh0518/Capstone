import { authService } from '../fbase'
import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider ,
  signInWithPopup
} from 'firebase/auth'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newAccount, setNewAccount] = useState(true)
  const [error,setError]=useState('')

  const onChange = (e) => {
    const { name, value } = e.target

    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'password') {
      setPassword(value)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      if (newAccount) {
        const data = await createUserWithEmailAndPassword(
          authService,
          email,
          password,
        )
        //console.log(data)
      } else {
        const data = await signInWithEmailAndPassword(
          authService,
          email,
          password,
        )
        //console.log(data)
      }
    } catch (e) {
      console.log(e.message)
      setError(e.message)
    }
  }

  const toggleAccount=()=>{
    setNewAccount(prev=>!prev)
  }


  const onSocialClick=async e=>{
    const {name,value}=e.target

    let provider

    if(name==='google'){
      provider=new GoogleAuthProvider()
    }
    else if(name=='github'){
      provider=new GithubAuthProvider()
    }


    const data=await signInWithPopup(authService,provider)
    console.log(data)
  }


  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? 'Create Account' : 'Log In'} />
        {error}
      </form>

      			{/* 새로 추가 */}
			<span onClick={toggleAccount}>
					<b>{newAccount ? "Sign In":"Join us"}</b>
			</span>

      <div>
        <button onClick={onSocialClick} name='google'>Goolge Login</button>
        <button onClick={onSocialClick} name='github'>GitHub Login</button>
      </div>
    </div>
  )
}

export default Auth
