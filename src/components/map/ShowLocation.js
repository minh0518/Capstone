//이 프로젝트에서 사용되는 카카오Map api부분을 사용하는 공간입니다
//각 페이지마다 지도서비스가 필요할 경우 이 컴포넌트를 호출하게 됩니다


import React, { useEffect } from 'react'

const { kakao } = window

const ShowLocation = ({ placeName }) => {
  console.log(placeName)


  useEffect(() => {
    const container = document.getElementById('myMap')
    let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    }
    const map = new kakao.maps.Map(container, options)

    const ps = new kakao.maps.services.Places()

    ps.keywordSearch(`${placeName}`, placesSearchCB)

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds()

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i])
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
        }

        map.setBounds(bounds)
      }
    }

    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      })

      // 마커에 클릭이벤트를 등록
      kakao.maps.event.addListener(marker, 'mouseover', function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            '</div>',
        )
        infowindow.open(map, marker)
      })
    }
  }, [placeName])

  return (
    <div
      id="myMap"
      style={{
        width: '250px',
        height: '250px',
        borderRadius:'10px'
      }}
    ></div>
  )
}

export default ShowLocation
