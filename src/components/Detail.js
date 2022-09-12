import React, { useState } from 'react';
import { useParams,Link } from 'react-router-dom'


const Detail = ({movieInfo}) => {

    const { id } = useParams()
    const [detailInfo,setDetailInfo]=useState(movieInfo[id-1])
    //console.log(detailInfo)

    return (
        <div>
            <img src={detailInfo.naver.image} width='170px' height='250px' alt='img'></img>
            <div>
                <h3>{detailInfo.kofic.movieNm}</h3>
                <ul>
                    <li>개봉일 {detailInfo.kofic.openDt}</li>
                    <li>관객수 {(detailInfo.kofic.audiAcc).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')}</li>
                    <li>감독 {(detailInfo.naver.director).split('|').join('')}</li>
                    <li>출연 {detailInfo.naver.actor.split('|').join(',')}</li>
                    <li>평점 {detailInfo.naver.userRating}</li>
                </ul>
            </div>


            <Link to='reviews'>Reviews</Link>
        </div>
    );
};


//https://movie.naver.com/movie/bi/mi/basic.naver?code=201641
//https://movie.naver.com/movie/bi/mi/review.naver?code=201641

export default Detail;