<<<<<<< HEAD
# 매물 검색 시스템

수파베이스와 GitHub Pages를 활용한 매물 검색 웹 애플리케이션입니다.

## 기능

- 매물 검색: 전화번호, 지역, 매물명, 소유자 등으로 검색
- 필터링: 지역, 매물 종류, 거래 유형별 필터링
- 상세 정보: 매물 상세 정보 모달 보기

## 구성 요소

- HTML/CSS/JavaScript로 작성된 정적 웹 페이지
- Supabase를 백엔드 데이터베이스로 활용
- GitHub Pages를 통한 호스팅

## 설치 및 실행

1. 저장소 클론
```
git clone https://github.com/[유저명]/property-search.git
cd property-search
```

2. 로컬에서 실행
```
# 간단한 HTTP 서버 실행 (Python 사용)
python -m http.server
```

3. 웹 브라우저에서 `http://localhost:8000` 접속

## 배포

GitHub Pages를 통해 배포하려면:

1. GitHub 저장소에 푸시
2. 저장소 설정에서 GitHub Pages 활성화
3. `main` 브랜치의 루트 폴더를 발행 소스로 선택

## 주의사항

- 이 애플리케이션은 데모용으로 만들어졌습니다.
- 실제 서비스에서는 보안 설정을 더 강화해야 합니다.

## 라이선스
=======
# Property Search System

A React application for searching and managing real estate properties, integrated with Supabase for data storage.

## Features

- Search properties by location, name, or contact information
- Filter properties by region, property type, and transaction type
- View detailed property information
- Responsive design for mobile and desktop

## Technologies Used

- React
- Styled Components
- Supabase (PostgreSQL database)
- GitHub Pages for hosting

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/gma3561/the-realty-itemlist.git
cd the-realty-itemlist
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

This project is configured for deployment to GitHub Pages:

```
npm run deploy
```

## Project Structure

```
property-search-react/
├── public/               # Static files
├── src/                  # Source code
│   ├── components/       # React components
│   ├── utils/            # Utility functions
│   ├── App.js            # Main app component
│   ├── App.css           # Global styles
│   └── index.js          # Entry point
├── package.json          # Dependencies and scripts
└── README.md             # Documentation
```

## Data Model

The application uses the following data structure in Supabase:

- `properties` table with columns for property details, contact information, etc.

## License
>>>>>>> e7f0742 (Initial commit: React property search application)

MIT