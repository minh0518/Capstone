import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'
import { dbService } from '../fbase'
import { Link } from 'react-router-dom';
import WriteReview from './WriteReview';

const Reviews = () => {

    

    const [writeMode,setWriteMode]=useState(false)

    const onToggleChange=()=>{
        setWriteMode((writeMode)=>!writeMode)
    }

    console.log(writeMode)


    return (
        <div>
            <div>review List</div>

            <div>
                <button onClick={onToggleChange}>글 쓰기</button>
                {writeMode? <WriteReview/>: '' }
            </div>
        </div>
    );
};

export default Reviews;