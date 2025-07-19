# Supabase 데이터베이스 설정 가이드

이 문서는 부동산 매물 관리 시스템의 Supabase 데이터베이스 설정을 위한 SQL 쿼리를 포함하고 있습니다.

## 설정 방법

1. [Supabase 대시보드](https://app.supabase.com)에 로그인합니다.
2. 프로젝트 `qwxghpwasmvottahchky`를 선택합니다.
3. 왼쪽 메뉴에서 "SQL 편집기" 또는 "SQL"을 클릭합니다.
4. "새 쿼리" 버튼을 클릭합니다.
5. 아래 SQL 쿼리를 붙여넣고 실행 버튼(▶️)을 클릭합니다.

## 전체 설정 SQL 쿼리

```sql
-- 1. 실행 함수 생성 (먼저 이것부터 실행하세요)
CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- 2. 매물 테이블 생성
CREATE TABLE IF NOT EXISTS public.properties (
    id SERIAL PRIMARY KEY,
    등록일 DATE,
    고객번호 TEXT,
    매물번호 TEXT,
    매물상태 TEXT,
    매물종류 TEXT,
    완료일자 TEXT,
    담당자 TEXT,
    지역 TEXT,
    매물명 TEXT,
    동 TEXT,
    호 TEXT,
    거래유형 TEXT,
    금액 TEXT,
    소재지 TEXT,
    소유자 TEXT,
    식별번호 TEXT,
    비고 TEXT,
    연락처1 TEXT,
    연락자1 TEXT,
    관계1 TEXT,
    연락처2 TEXT,
    연락자2 TEXT,
    관계2 TEXT,
    연락처3 TEXT,
    연락자3 TEXT,
    관계3 TEXT,
    연락메모 TEXT,
    created_by UUID REFERENCES auth.users,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 사용자 프로필 테이블 생성
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_region ON public.properties(지역);
CREATE INDEX IF NOT EXISTS idx_property_name ON public.properties(매물명);
CREATE INDEX IF NOT EXISTS idx_transaction_type ON public.properties(거래유형);
CREATE INDEX IF NOT EXISTS idx_contact1 ON public.properties(연락처1);
CREATE INDEX IF NOT EXISTS idx_owner ON public.properties(소유자);
CREATE INDEX IF NOT EXISTS idx_created_by ON public.properties(created_by);

-- 5. RLS 활성화
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. 매물 테이블 보안 정책 설정
-- 기본 조회 정책 (연락처 정보 제외)
CREATE POLICY "모든_사용자는_연락처_외_정보_조회_가능" 
ON public.properties 
FOR SELECT 
TO anon
USING (true);

-- 관리자는 모든 매물에 대한 모든 작업 가능
CREATE POLICY "관리자는_모든_매물_관리_가능" 
ON public.properties 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role = 'admin'
  )
);

-- 직원은 자신이 등록한 매물의 모든 정보 조회 가능
CREATE POLICY "직원은_자신이_등록한_매물_조회_가능" 
ON public.properties 
FOR SELECT
TO authenticated
USING (
  created_by = auth.uid()
);

-- 직원은 매물 등록 가능
CREATE POLICY "직원은_매물_등록_가능" 
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role IN ('staff', 'admin')
  )
);

-- 직원은 자신이 등록한 매물만 수정 가능
CREATE POLICY "직원은_자신이_등록한_매물만_수정_가능" 
ON public.properties 
FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid()
);

-- 직원은 자신이 등록한 매물만 삭제 가능
CREATE POLICY "직원은_자신이_등록한_매물만_삭제_가능" 
ON public.properties 
FOR DELETE
TO authenticated
USING (
  created_by = auth.uid()
);

-- 7. 사용자 프로필 테이블 보안 정책 설정
-- 관리자는 모든 사용자 프로필 관리 가능
CREATE POLICY "관리자는_모든_사용자_프로필_관리_가능" 
ON public.user_profiles 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role = 'admin'
  )
);

-- 사용자는 자신의 프로필 조회 가능
CREATE POLICY "사용자는_자신의_프로필_조회_가능" 
ON public.user_profiles 
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
);

-- 사용자는 자신의 프로필 수정 가능 (역할 제외)
CREATE POLICY "사용자는_자신의_프로필_수정_가능" 
ON public.user_profiles 
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
)
WITH CHECK (
  id = auth.uid() AND role = OLD.role
);

-- 8. 뷰 생성
-- 연락처 정보 보호를 위한 뷰
CREATE OR REPLACE VIEW public.public_properties AS
SELECT
  id,
  등록일,
  매물번호,
  매물상태,
  매물종류,
  완료일자,
  담당자,
  지역,
  매물명,
  동,
  호,
  거래유형,
  금액,
  소재지,
  소유자,
  비고,
  created_at
FROM public.properties;

-- 관리자 전용 뷰
CREATE OR REPLACE VIEW public.admin_properties AS
SELECT *
FROM public.properties;
```

## 관리자 계정 설정

테이블 설정 완료 후 관리자 계정을 생성하려면 다음 단계를 따르세요:

1. Supabase 대시보드에서 Authentication > Users로 이동합니다.
2. "Add User" 또는 "사용자 추가" 버튼을 클릭합니다.
3. 관리자 계정으로 사용할 이메일과 비밀번호를 입력하고 사용자를 생성합니다.
4. 생성된 사용자의 UUID를 확인합니다.
5. 새 SQL 쿼리 창에서 다음 쿼리를 실행합니다 (UUID와 이메일, 이름을 실제 정보로 변경하세요):

```sql
-- 관리자 계정 설정
INSERT INTO public.user_profiles (id, email, full_name, role)
VALUES 
('여기에-사용자-UUID-입력', '관리자이메일@example.com', '관리자 이름', 'admin');
```

## 테이블 확인

설정이 완료된 후, 다음 쿼리로 테이블이 올바르게 생성되었는지 확인할 수 있습니다:

```sql
-- 테이블 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 보안 정책 확인
SELECT * 
FROM pg_policies 
WHERE schemaname = 'public';
```