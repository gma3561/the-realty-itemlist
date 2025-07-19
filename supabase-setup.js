// Supabase 설정 스크립트
import { supabase } from './src/utils/supabaseClient.js';

async function setupSupabase() {
  try {
    console.log('Supabase 테이블 및 정책 설정을 시작합니다...');
    
    // 1. 매물 테이블 생성
    console.log('매물 테이블 생성 중...');
    const { error: propertiesError } = await supabase.rpc('create_properties_table');
    
    if (propertiesError) {
      console.error('매물 테이블 생성 오류:', propertiesError);
      return;
    }
    
    // 2. 사용자 프로필 테이블 생성
    console.log('사용자 프로필 테이블 생성 중...');
    const { error: userProfilesError } = await supabase.rpc('create_user_profiles_table');
    
    if (userProfilesError) {
      console.error('사용자 프로필 테이블 생성 오류:', userProfilesError);
      return;
    }
    
    // 3. 권한 정책 설정
    console.log('권한 정책 설정 중...');
    const { error: policiesError } = await supabase.rpc('setup_security_policies');
    
    if (policiesError) {
      console.error('권한 정책 설정 오류:', policiesError);
      return;
    }
    
    console.log('Supabase 설정이 완료되었습니다!');
  } catch (error) {
    console.error('Supabase 설정 중 오류 발생:', error);
  }
}

// 스크립트 실행
setupSupabase();