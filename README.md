# LikeAPro_Server

## 1. 개요

> 신한투자증권 프로 디지털 아카데미의 내부 커뮤니티  
> **지원 기능**
>
> -   로그인 & 회원가입
> -   벡준 알고리즘 문제 추천
> -   지식 투자 (Q&A)
> -   랭킹
> -   달력

이름: Like A Pro (Server)  
플랫폼: Node.js & Express  
DB: Mongo DB   
팀원: 유영서 / 이선영 / 김동원 / 정채헌

## 2. 프로젝트 구조

```
├── README.md
├── package-lock.json
├── package.json
└── src
    ├── app.js
    ├── db
    ├── middleware
    ├── router
    ├── service
    └── util
```

### app.js

실행되는 애플리케이션 메인 파일 입니다.

### db

[📒 DB Docs](./src/db/README.md)  
DB와 관련된 역할을 하는 모듈 입니다. DB는 현재 `Mongo DB`를 사용하며 `Mongoose`를 사용하여 애플리케이션과 연결하였습니다.

**Responsibility**

-   DB 초기 세팅
-   DB 스미카, 모델 정의

### middleware

[📒 Middleware Docs](./src/middleware/README.md)  
`Express`에서 사용할 미들웨어들이 모여져 있는 모듈입니다.
**Responsibility**

-   endpoint와 비즈니스 로직 연결
-   Response 세팅

### router

[📒 Router Docs](./src/router/README.md)  
엔드 포인트를 처리하여 서비스 로직과 연결할 수 있는 `Router` 모듈입니다.  
비즈니스 로직은 웬만하면 넣지 않습니다.  
**Responsibility**

-   endpoint와 비즈니스 로직 연결
-   Response 세팅

### service

[📒 Service Docs](./src/service/README.md)   
`비즈니스(핵심) 로직`이 모여져 있는 모듈입니다. 해당 모듈은 Express의 기능(req, res, next)에 의존적이지 않게 설계되어 있습니다.  
또한 외부로 공개될 함수 / 변수만 `export` 하도록 합니다.

**Responsibility**

-   DB 및 기타 기술을 활용하여 비즈니스 로직 처리
-   Express에 의존적이지 않음

### util

[📒 Util Docs](./src/util/README.md)

유틸성의 기능들이 모여져 있는 모듈입니다. 전체적인 코드에서 사용되지만 웬만하면 Express에 의존적이지 않게 설계해야합니다.  
example: Date를 파싱하여 "몇달전" / "몇분전" / "방금전" 등으로 파싱하기 (현재 프로젝트에서 실제로 사용되는 모듈은 아닙니다.)

**Responsibility**

-   DB 및 기타 기술을 활용하여 비즈니스 로직 처리
-   Express에 의존적이지 않음
