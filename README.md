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

MIT