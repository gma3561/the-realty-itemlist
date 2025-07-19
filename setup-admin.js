// 관리자 계정 설정 스크립트
const { createClient } = require('@supabase/supabase-js');

// Supabase 연결 정보
const supabaseUrl = 'https://qwxghpwasmvottahchky.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGdocHdhc212b3R0YWhjaGt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkxMjc1OSwiZXhwIjoyMDY4NDg4NzU5fQ.QvQ2axKYWWizJ6h_aefiAGKoGsF7dfOf1L0J3mVkAvU';

// Service Role 키로 클라이언트 생성 (관리자 권한 필요)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 관리자 계정 정보
const adminEmail = '관리자 이메일'; // 여기에 관리자 이메일 입력
const adminPassword = '관리자 비밀번호'; // 여기에 관리자 비밀번호 입력
const adminName = '관리자 이름'; // 여기에 관리자 이름 입력

async function setupAdmin() {
  try {
    console.log('관리자 계정 설정을 시작합니다...');
    
    // 1. 관리자 계정 생성
    console.log('관리자 사용자 생성 중...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });
    
    if (authError) {
      console.error('관리자 계정 생성 오류:', authError);
      return;
    }
    
    console.log('관리자 계정이 생성되었습니다:', authData.user.id);
    
    // 2. 사용자 프로필 테이블에 관리자 정보 추가
    console.log('관리자 프로필 생성 중...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        email: adminEmail,
        full_name: adminName,
        role: 'admin'
      }]);
      
    if (profileError) {
      console.error('관리자 프로필 생성 오류:', profileError);
      return;
    }
    
    console.log('관리자 설정이 완료되었습니다!');
    console.log('다음 정보로 로그인할 수 있습니다:');
    console.log('- 이메일:', adminEmail);
    console.log('- 비밀번호: [입력한 비밀번호]');
    
  } catch (error) {
    console.error('관리자 설정 중 오류 발생:', error);
  }
}

// 스크립트 실행
setupAdmin().catch(console.error);