//리뷰를 보여주는 공간이고 Bootstrap의 Tab 스타일을 적용하기 위해
//ShowReview페이지에서 작성자이름  ,  나머지 정보들(내용 및 평점 ,작성시간)을 나눴고
//여기는 그 중에서 작성자이름을 담당하는 공간입니다

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


