```
2023년 4월부로, 네이버 영화 API 서비스가 중단 됐으므로 실제 사용은 불가능합니다
```

<img src="https://github.com/minh0518/Capstone/assets/78631876/90f47975-e2c7-4c35-b040-a4480a715aa3" width="700" height="700"/>

## **서경대학교 4학년 졸업작품 캡스톤 프로젝트**

> **영화 분석 및 실시간 소셜 웹으로 ,** 현재 영화관에서 상영되고 있는 박스오피스 순위를 기반으로, 각종 소셜 서비스들을 제공합니다
> 

<br>
<br>

## 핵심 기능 구현 정보

1. **로그인**
    - Firebase Auth를 이용한 Google 로그인
2. **영화 분석**
    - 영화진흥 위원회 API 와 네이버 영화 API를 조합해서 **현재 상영중인 박스오피스 순위** 제공
    - 영화 카테고리별 (한국영화,해외영화, 예술영화 , 상업영화) **추가 필터링**
    - Apex Chart를 이용한 **영화 세부 정보(전일 대비 랭킹 변화 , 누적 관객수 등)를 시각화**
    - Firebase의 Auth 와 FireStore DB를 이용해서 구현한 **로그인 기반 영화 리뷰 기능**
3. **소셜 , 실시간 채팅**
    - Firebase의 실시간 처리(onsnapshot)을 응용 + 무분별한 사용 방지를 위해 게시판 이용자만 사용가능한 **실시간 채팅**
    - KAKAO MAP API 와 다른 카테고리를 통해 글을 작성할 수 있는 **게시판**
    - 장르별 영화 추천 , 프로필 사진이나 닉네임같은 인적사항을 적용할 수 있는 **개인 프로필 기능**

<br>
<br>

## 🛠 사용 기술

**React , JavaScript , HTML5 , Styled-components , react-bootstrap , Firebase (authentication, firestore , storage) , Git**

<br>
<br>

---


<br>
<br>

# 프로젝트 화면


<br>
<br>


## **로그인**

![image](https://github.com/minh0518/Capstone/assets/78631876/69753496-0bae-41a2-8e3a-1b1cafa7c1f1)


로그인은 간편하게 소셜 로그인으로 구현하였습니다

- 구글 로그인
- 깃허브 로그인

<br>

---

<br>

## 메인 페이지

![image](https://github.com/minh0518/Capstone/assets/78631876/08b0d436-c483-471c-8fc4-dc45d814c311)


> 주요 기능 2가지인 박스오피스 정보 및 소셜기능 선택 가능합니다
> 

![image](https://github.com/minh0518/Capstone/assets/78631876/636c5774-492e-4057-b79e-4eeca30a4f49)


> 영화진흥위원회 api 와 네이버 영화 api  를 조합해서 현재 상영중인 박스오피스 순위를
> 
> 
> 캐러셀로 보여줍니다
> 

> 카테고리별 ( 외국 , 국내 , 예술 , 상업 ) 영화 순위를 볼 수도 있습니다
> 


<br>

---

<br>

## 영화 상세정보

![image](https://github.com/minh0518/Capstone/assets/78631876/def5a277-3707-44ff-9572-4bd0c3dc632a)
![image](https://github.com/minh0518/Capstone/assets/78631876/f5e35327-c6cd-49d5-9edb-20404c913b48)
![image](https://github.com/minh0518/Capstone/assets/78631876/21f1d48c-3f18-4932-a09e-535e4b05237e)

- 이전 페이지에서 봤던 정보와 다른 자세한 영화 정보들이 상단에 있으며 
차트를 기반으로한 분석내용 및 로그인 유저들을 대상으로 한 리뷰들이 있는 공간입니다
- 리뷰는 로그인을 기반으로 작동하기 때문에 자신이 작성한 리뷰만 수정 및 삭제가 가능합니다

<br>

---
<br>

## 소셜 기능

### Read

![image](https://github.com/minh0518/Capstone/assets/78631876/3037eb94-fc15-46de-8037-6ef937b9367c)

![image](https://github.com/minh0518/Capstone/assets/78631876/94a9a218-935e-4142-89f6-d3324a4bef08)

    
> 카테고리(영화 제목 , 영화관 , 구단위 지역 )를 적용할 수 있는 게시글 기능이 있습니다
>

<br>
<br>

### Write

![image](https://github.com/minh0518/Capstone/assets/78631876/7b6f34d8-0020-40ab-8947-60a1a179b98e)

![image](https://github.com/minh0518/Capstone/assets/78631876/7ab8321f-0c1c-4299-8da7-2cec190e6078)

> 현재 박스오피스에서 상영중인 영화로 선택해서 작성할 수 있게 했습니다
> 
    
> 지역 및 영화관 선택 또한 가능합니다
> 

<br>

---

<br>

## 실시간 채팅

**채팅 기능은 navbar에서 선택해서 사용 가능합니다**

<img src="https://github.com/minh0518/Capstone/assets/78631876/7317e89a-f8c3-4bc7-9224-f450c2c317fd" width="550" height="400"/>
<img src="https://github.com/minh0518/Capstone/assets/78631876/938476ba-2b10-464e-9e88-b6bca94ef605" width="550" height="400"/>



- 무분별한 채팅을 막기 위해 **게시글을 작성한 대상에만 채팅을 걸 수 있도록 필터링 합니다**
    <img src="https://github.com/minh0518/Capstone/assets/78631876/caaa48ce-f307-4d3c-a1ed-a10322b06da6" width="550" height="400"/>
        
    - 게시글의 작성자 계정이 ‘조민호입니닷’ , ‘테스트계정1’ 이 있다면
    - 자신을 제외한 **`테스트계정1 에게만`** 현재 대화가 가능한 것이며
    - 대화가능한 유저 버튼 위에 hover를 하게 되면 대화 가능한 닉네임들이 보입니다


<br>
<br>

![image](https://github.com/minh0518/Capstone/assets/78631876/99d96911-8089-4853-b8f3-d31b9cdf41e1)


> 닉네임을 입력하면 아래 대화 목록에 새로운 대화 목록이 생성됩니다
> 
- 카카오톡과 비슷한 UI를 적용했으며
- 각 대화에 hover를 하면 대화 시간이 보입니다

![image](https://github.com/minh0518/Capstone/assets/78631876/8d08c24c-e1a5-4138-818d-66c4273d4cd2)

<br>
<br>

> 뒤로가기 및 대화 나가기의 기능들로 대화를 종료하거나 대화를 삭제할 수 있습니다
> 

> **채팅 상대방에도 동시 적용됩니다**
> 

![image](https://github.com/minh0518/Capstone/assets/78631876/57858666-89bc-4127-9075-5bfbbbe624ef)


> **중복채팅 과 틀린 닉네임 입력에 대한 에러처리가 되어 있습니다**
> 

<br>

---

<br>

## 프로필

1. 프로필 페이지는 상단 navbar의 프로필 사진을 클릭해서 갈 수도 있고
    
    ![image](https://github.com/minh0518/Capstone/assets/78631876/11ae69c5-ebe2-42ff-b6e6-361f8580252f)

    
2. 오른쪽 navbar의 메뉴를 통해 갈 수도 있습니다
    
    ![image](https://github.com/minh0518/Capstone/assets/78631876/b47a251a-6907-4eb7-a5e4-b7fe41bd3894)

    

![image](https://github.com/minh0518/Capstone/assets/78631876/5f7138ef-c86e-4d63-b3a8-72f5e8ef2bee)

![image](https://github.com/minh0518/Capstone/assets/78631876/5aa5bab4-0994-49b0-858b-72eeca934e42)


> 기본 인적사항으로 닉네임 , 생년월일 , 관심장르 , BestPick(인생영화) , 자주가는 영화관 을 등록할 수 있습니다
> 

> 장르를 선택하게 되면,  해당 장르를 기반으로 현재 상영중인 영화를 추천 해줍니다
> 

> **프로필을 수정하게 되면 해당 계정으로 사용된 모든 CRUD(게시판 , 채팅 , 리뷰)또한 동시 수정 됩니다.**
>

