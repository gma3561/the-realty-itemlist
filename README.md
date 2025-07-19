# 부동산 매물 관리 시스템

부동산 매물 검색 및 관리를 위한 React 애플리케이션입니다. Supabase를 백엔드로 사용하여 데이터를 저장하고 사용자 인증을 처리합니다.

## 배포 URL

애플리케이션은 GitHub Pages에 배포되었습니다:
https://gma3561.github.io/the-realty-itemlist/

## 주요 기능

- 사용자 인증 (로그인/로그아웃)
- 역할 기반 접근 제어 (관리자/직원/일반 사용자)
- 매물 등록 및 관리
- 매물 검색 및 필터링
- 연락처 정보 접근 제한 (관리자, 등록자만 볼 수 있음)
- 관리자 대시보드

## 설치 및 실행

### 요구사항

- Node.js 14.x 이상
- npm 6.x 이상

### 로컬 개발 환경 설정

1. 저장소 복제
```bash
git clone https://github.com/gma3561/the-realty-itemlist.git
cd property-search-react
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm start
```

### Supabase 설정

1. 실행 함수 생성
   - Supabase 대시보드의 SQL 편집기에서 먼저 `setup-sql-function.sql` 스크립트를 실행:
   ```sql
   -- SQL 실행 함수 생성
   CREATE OR REPLACE FUNCTION public.exec_sql(query text)
   RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     EXECUTE query;
   END;
   $$;
   ```

2. API를 통한 설정 실행
   ```bash
   node setup-supabase.js
   ```

3. 또는 SQL 편집기에서 직접 설정
   - Supabase 대시보드에서 SQL 편집기를 열고 `setup-supabase.sql` 스크립트를 실행하여 필요한 테이블과 정책을 생성합니다.

4. 초기 관리자 계정 생성:
   - Supabase Authentication에서 새 사용자 생성
   - SQL 편집기에서 다음 쿼리 실행:
   ```sql
   INSERT INTO public.user_profiles (id, email, full_name, role)
   VALUES ('[사용자 ID]', '[이메일]', '[이름]', 'admin');
   ```

### 배포

GitHub Pages에 배포하려면:

```bash
npm run deploy
```

## 역할과 권한

- **관리자**: 모든 매물과 사용자 관리 가능
- **직원**: 매물 등록, 자신이 등록한 매물 관리, 연락처 확인
- **일반 사용자**: 매물 정보 검색 및 조회 (연락처 제외)

## 기술 스택

- React
- Supabase (인증, 데이터베이스)
- Styled Components
- React Router

## 프로젝트 구조

```
/src
  /components       - 재사용 가능한 UI 컴포넌트
  /contexts         - React Context (인증 등)
  /pages            - 주요 페이지 컴포넌트
  /utils            - 유틸리티 함수
```

## 라이선스

MIT