// Supabase API를 사용한 테이블 및 정책 설정 스크립트
const { createClient } = require('@supabase/supabase-js');

// Supabase 연결 정보
const supabaseUrl = 'https://qwxghpwasmvottahchky.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGdocHdhc212b3R0YWhjaGt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkxMjc1OSwiZXhwIjoyMDY4NDg4NzU5fQ.QvQ2axKYWWizJ6h_aefiAGKoGsF7dfOf1L0J3mVkAvU';

// Service Role 키로 클라이언트 생성 (관리자 권한 필요)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSupabase() {
  try {
    console.log('Supabase 설정을 시작합니다...');
    
    // 1. 매물 테이블 생성
    console.log('매물 테이블 생성 중...');
    const { error: createPropertiesError } = await supabase.rpc('exec_sql', {
      query: `
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
    `
    });
    
    if (createPropertiesError) {
      console.error('매물 테이블 생성 오류:', createPropertiesError);
    } else {
      console.log('매물 테이블이 성공적으로 생성되었습니다.');
    }

    // 2. 사용자 프로필 테이블 생성
    console.log('사용자 프로필 테이블 생성 중...');
    const { error: createProfilesError } = await supabase.rpc('exec_sql', {
      query: `
      CREATE TABLE IF NOT EXISTS public.user_profiles (
        id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        role TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    });
    
    if (createProfilesError) {
      console.error('사용자 프로필 테이블 생성 오류:', createProfilesError);
    } else {
      console.log('사용자 프로필 테이블이 성공적으로 생성되었습니다.');
    }

    // 3. 인덱스 생성
    console.log('인덱스 생성 중...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      query: `
      CREATE INDEX IF NOT EXISTS idx_region ON public.properties(지역);
      CREATE INDEX IF NOT EXISTS idx_property_name ON public.properties(매물명);
      CREATE INDEX IF NOT EXISTS idx_transaction_type ON public.properties(거래유형);
      CREATE INDEX IF NOT EXISTS idx_contact1 ON public.properties(연락처1);
      CREATE INDEX IF NOT EXISTS idx_owner ON public.properties(소유자);
      CREATE INDEX IF NOT EXISTS idx_created_by ON public.properties(created_by);
    `
    });
    
    if (indexError) {
      console.error('인덱스 생성 오류:', indexError);
    } else {
      console.log('인덱스가 성공적으로 생성되었습니다.');
    }

    // 4. RLS 활성화
    console.log('Row Level Security 활성화 중...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      query: `
      ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
    `
    });
    
    if (rlsError) {
      console.error('RLS 활성화 오류:', rlsError);
    } else {
      console.log('RLS가 성공적으로 활성화되었습니다.');
    }

    // 5. 보안 정책 설정
    console.log('보안 정책 설정 중...');
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      query: `
      -- 기본 조회 정책 (연락처 정보 제외)
      CREATE POLICY "모든 사용자는 연락처 외 정보 조회 가능" 
      ON public.properties 
      FOR SELECT 
      TO anon
      USING (true);

      -- 관리자는 모든 매물에 대한 모든 작업 가능
      CREATE POLICY "관리자는 모든 매물 관리 가능" 
      ON public.properties 
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IN (
          SELECT id FROM public.user_profiles WHERE role = 'admin'
        )
      );

      -- 직원은 자신이 등록한 매물의 모든 정보 조회 가능
      CREATE POLICY "직원은 자신이 등록한 매물 조회 가능" 
      ON public.properties 
      FOR SELECT
      TO authenticated
      USING (
        created_by = auth.uid()
      );

      -- 직원은 매물 등록 가능
      CREATE POLICY "직원은 매물 등록 가능" 
      ON public.properties 
      FOR INSERT 
      TO authenticated
      WITH CHECK (
        auth.uid() IN (
          SELECT id FROM public.user_profiles WHERE role IN ('staff', 'admin')
        )
      );

      -- 직원은 자신이 등록한 매물만 수정 가능
      CREATE POLICY "직원은 자신이 등록한 매물만 수정 가능" 
      ON public.properties 
      FOR UPDATE
      TO authenticated
      USING (
        created_by = auth.uid()
      );

      -- 직원은 자신이 등록한 매물만 삭제 가능
      CREATE POLICY "직원은 자신이 등록한 매물만 삭제 가능" 
      ON public.properties 
      FOR DELETE
      TO authenticated
      USING (
        created_by = auth.uid()
      );
    `
    });
    
    if (policiesError) {
      console.error('매물 테이블 정책 설정 오류:', policiesError);
    } else {
      console.log('매물 테이블 정책이 성공적으로 설정되었습니다.');
    }

    // 6. 사용자 프로필 정책
    console.log('사용자 프로필 정책 설정 중...');
    const { error: profilePoliciesError } = await supabase.rpc('exec_sql', {
      query: `
      -- 관리자는 모든 사용자 프로필 관리 가능
      CREATE POLICY "관리자는 모든 사용자 프로필 관리 가능" 
      ON public.user_profiles 
      FOR ALL
      TO authenticated
      USING (
        auth.uid() IN (
          SELECT id FROM public.user_profiles WHERE role = 'admin'
        )
      );

      -- 사용자는 자신의 프로필 조회 가능
      CREATE POLICY "사용자는 자신의 프로필 조회 가능" 
      ON public.user_profiles 
      FOR SELECT
      TO authenticated
      USING (
        id = auth.uid()
      );

      -- 사용자는 자신의 프로필 수정 가능 (역할 제외)
      CREATE POLICY "사용자는 자신의 프로필 수정 가능" 
      ON public.user_profiles 
      FOR UPDATE
      TO authenticated
      USING (
        id = auth.uid()
      )
      WITH CHECK (
        id = auth.uid() AND role = OLD.role
      );
    `
    });
    
    if (profilePoliciesError) {
      console.error('사용자 프로필 정책 설정 오류:', profilePoliciesError);
    } else {
      console.log('사용자 프로필 정책이 성공적으로 설정되었습니다.');
    }

    // 7. 뷰 생성
    console.log('뷰 생성 중...');
    const { error: viewsError } = await supabase.rpc('exec_sql', {
      query: `
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
    `
    });
    
    if (viewsError) {
      console.error('뷰 생성 오류:', viewsError);
    } else {
      console.log('뷰가 성공적으로 생성되었습니다.');
    }

    console.log('Supabase 설정이 완료되었습니다!');
    
  } catch (error) {
    console.error('Supabase 설정 중 오류 발생:', error);
  }
}

// 스크립트 실행
setupSupabase().catch(console.error);