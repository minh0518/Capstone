import { getDocs, addDoc, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { dbService } from '../../fbase'


const ShowLists = ({movieTitle,theater,region}) => {
  
  const [post,setPosts]=useState([])



  const onChange = (e) => {    const { name, value } = e.target


  }

  return (
    <div>
      <label htmlFor="title">영화 :</label>
      <select id="title" name="title" onChange={onChange}>
        <option value="default" disabled>
          영화를 선택하세요
        </option>
        {movieTitle.map((i, index) => {
          return (
            <option key={index} value={i}>
              {i}
            </option>
          )
        })}
      </select>
      <br />
      <label htmlFor="theater">영화관 :</label>
      <select id="theater" name="theater" onChange={onChange}>
        <option value="default" disabled>
          영화관을 선택하세요
        </option>
        {theater.map((i, index) => {
          return (
            <option key={index} value={i}>
              {i}
            </option>
          )
        })}
      </select>
      <br />
      <label htmlFor="theater">지역(구) : </label>
      <select id="theater" name="theater" onChange={onChange}>
        <option value="default" disabled>
          지역(구)을 선택하세요
        </option>
        {region.map((i, index) => {
          return (
            <option key={index} value={i}>
              {i}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default ShowLists
