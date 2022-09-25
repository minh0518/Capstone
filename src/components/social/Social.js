import React, { useState, useEffect } from 'react'
import Post from './Post'
import List from './List'

const Social = () => {
  const [mode, setMode] = useState('list')

  const onClick = (e) => {
    const { name, value } = e.target

    if(name==='list'){
      setMode('list')
    }
    else{
      setMode('write')
    }

    
  }

  return (
    <>
      <button onClick={onClick} name="list">
        List
      </button>
      <button onClick={onClick} name="write">
        Write
      </button>

      {mode === 'list' ? <List /> : <Post />}
    </>
  )
}

export default Social
