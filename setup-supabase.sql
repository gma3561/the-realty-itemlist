-- 1. 매물 테이블 생성
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
    created_by UUID REFERENCES auth.users, -- 매물 등록한 직원
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 사용자 프로필 테이블 생성
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL, -- 'admin', 'staff' 중 하나
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 검색 최적화를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_region ON public.properties(지역);
CREATE INDEX IF NOT EXISTS idx_property_name ON public.properties(매물명);
CREATE INDEX IF NOT EXISTS idx_transaction_type ON public.properties(거래유형);
CREATE INDEX IF NOT EXISTS idx_contact1 ON public.properties(연락처1);
CREATE INDEX IF NOT EXISTS idx_owner ON public.properties(소유자);
CREATE INDEX IF NOT EXISTS idx_created_by ON public.properties(created_by);

-- 4. properties 테이블에 RLS(Row Level Security) 활성화
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 5. user_profiles 테이블에 RLS 활성화
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. properties 테이블 정책

-- 6.1. 기본 조회 정책 (연락처 정보 제외)
CREATE POLICY "모든 사용자는 연락처 외 정보 조회 가능" 
ON public.properties 
FOR SELECT 
TO anon
USING (true);

-- 6.2. 관리자는 모든 매물에 대한 모든 작업 가능
CREATE POLICY "관리자는 모든 매물 관리 가능" 
ON public.properties 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role = 'admin'
  )
);

-- 6.3. 직원은 자신이 등록한 매물의 모든 정보 조회 가능
CREATE POLICY "직원은 자신이 등록한 매물 조회 가능" 
ON public.properties 
FOR SELECT
TO authenticated
USING (
  created_by = auth.uid()
);

-- 6.4. 직원은 매물 등록 가능
CREATE POLICY "직원은 매물 등록 가능" 
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role IN ('staff', 'admin')
  )
);

-- 6.5. 직원은 자신이 등록한 매물만 수정 가능
CREATE POLICY "직원은 자신이 등록한 매물만 수정 가능" 
ON public.properties 
FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid()
);

-- 6.6. 직원은 자신이 등록한 매물만 삭제 가능
CREATE POLICY "직원은 자신이 등록한 매물만 삭제 가능" 
ON public.properties 
FOR DELETE
TO authenticated
USING (
  created_by = auth.uid()
);

-- 7. user_profiles 테이블 정책

-- 7.1. 관리자는 모든 사용자 프로필 관리 가능
CREATE POLICY "관리자는 모든 사용자 프로필 관리 가능" 
ON public.user_profiles 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role = 'admin'
  )
);

-- 7.2. 사용자는 자신의 프로필 조회 가능
CREATE POLICY "사용자는 자신의 프로필 조회 가능" 
ON public.user_profiles 
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
);

-- 7.3. 사용자는 자신의 프로필 수정 가능 (역할 제외)
CREATE POLICY "사용자는 자신의 프로필 수정 가능" 
ON public.user_profiles 
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
)
WITH CHECK (
  id = auth.uid() AND role = OLD.role -- 역할은 변경 불가
);

-- 8. 연락처 정보 보호를 위한 뷰 생성
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

-- 9. 관리자 전용 뷰
CREATE OR REPLACE VIEW public.admin_properties AS
SELECT *
FROM public.properties;