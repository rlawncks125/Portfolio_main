# 포토폴리오 메인 페이지

Form 추가 레스토랑 이미지 여러개로 랜더링 할수있게 form UI/UX 작업 ( 미정)

## 문제점

레스토랑 만들떄 지도 e.coord로 가져온 position 좌표는 x,y좌표가 맞는데
방만들때 maker.getPostion()으로 가져온거는 x,y좌표가 바껴있다.

# 수정할거

UI/UX ( 방설정 , 기타 설정)
대기 유저 거절 버튼 추가
UI/UX 변경후 -> 레스토랑 소켓 데이터 연결 방법 변경
( 소켓 변경시 그 레스토랑 내용 REST API로 다시 받는 방법(호출) 에서 -->
레스토랑id,댓글변경id,대댓글변경id등을 소켓 데이터로 받아서 변경내용만 프론트에서 변경 )

## 레스토랑 소켓 업데이트 변경 구성안

- 업데이트 발생시 해당 레스토랑 , 방정보 업데이트 ( <-- 현재 , 유저가 많아지면 서벗 패킷 횟수가 증가에서 변경 검토 )
- 업데이트 버튼을 만들고 업데이트 트리거 발생시 알려주는 UI 삽입
- 방정보 , 레스토랑 , 댓글 등 변경이 있을시 변경 내용을 받아와 업데이트 ( 소켓 데이터 처리 세분화 )

# 방에 있는 음식점 필터( 지역 ,음식 분야 , 태그 등등) o 방법 안정함

- 1. 모바일 (버튼 클릭시 필터) , 데탑(텍스트 입력시 실시간 필터)
- 2. 둘다 ( 버튼 클릭시 필터)
- 3. 둘다 ( 텍스트 입력시 실시간 필터)
- select가 모바일시

# 방만들시 시작 lating 설정할수 있게 ui/ux작업 o

( addFrom 처럼 방만들기 클릭시 form 활성화 ,
create시 정보 emit로 전달하기,
마커로 마크한 좌표 표시 ( 1개만 )
)

# 유효성 검사 ( validation )

- 에러 알리는 방법 ( Error text , alert )
- addFrom은 레스토랑 이름만 검사하면 될듯
- userCreateForm 검사
- userLoginForm 검사

# 레스토랑 정보 수정

# 레스토랑 찾기 할때 필터 ( 방 제목 , 만든 유저 , 지역 ) o

# UI/UX 예제 찾기

- tailwind template보고 윤곽잡기 or
- bootstrap 테마 구매 고민

# 프론트에서 승인 대기중인 유저 요청 승락처리 구현 ( O )

## pc 사이드바

참여 중인 방
방 찾기
마이페이지
방 신청 유저 목록 ( 설정 )
음식점 찾기 ( 필터 , 지도 에서 )

방 정보 변경 ( 설정 , 백단 구현 o ) <==#

# 웹소켓

- 레스토랑 업데이트 ( 댓글 추가 , 수정 , 삭제 ) ( o )
- 방 수락 업데이트 ( 요청 신청한 id유저만 ) ( o )
- 마커 업데이트 ( o )
- 방 정보 업데이트 ( 수정 ( o ) , 삭제 , ) <==#
  방 삭제지 삭제됬다는 알람 알림
  확인시 방리스트 화면으로 이동
  WebSocket 방 남아 있는지 확인

# netlify 배포 추가 설정

### 환경변수 추가

NODE_VERSION=14.17.5

## netlify.toml 파일에 프록시 설정 추가

```
// netlify.toml

[[redirects]]
  from = "/api/*"
  to = "https://pofol-backend.herokuapp.com/:splat"
  status = 200



[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

```

## build시 netlify.toml파일 dist폴더에 복사

```js
//package.js
{
  ...
  "build": "vue-cli-service build && cp ./netlify.toml ./dist",
  ...
}
```
