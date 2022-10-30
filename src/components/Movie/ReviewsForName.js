import React, { useState } from 'react'
import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { dbService } from '../../fbase'
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';


const Reviews = ({ thisReview,linkNum }) => {

  return (
    <ListGroup>
       <ListGroup.Item action href={`#link${linkNum}`}>
                <>
                <img src={thisReview.userImg} width="30px" height="30px" alt="img" style={{borderRadius:'50px'}}/>
                <span style={{marginLeft:'15px'}}>{thisReview.userName}</span>
                </>
        </ListGroup.Item>
      </ListGroup>
  )
}

export default Reviews


