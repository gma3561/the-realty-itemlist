// PostgreSQL 및 Supabase API를 통한 관리자 계정 설정 스크립트
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// 데이터베이스 연결 정보
const connectionString = 'postgresql://postgres:Tere12!@@db.qwxghpwasmvottahchky.supabase.co:5432/postgres';

// Supabase 연결 정보
const supabaseUrl = 'https://qwxghpwasmvottahchky.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGdocHdhc212b3R0YWhjaGt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkxMjc1OSwiZXhwIjoyMDY4NDg4NzU5fQ.QvQ2axKYWWizJ6h_aefiAGKoGsF7dfOf1L0J3mVkAvU';

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PostgreSQL 클라이언트 생성
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// 관리자 계정 정보 (이 값들을 변경하세요)
const adminEmail = '관리자이메일@example.com';
const adminPassword = '관리자비밀번호';
const adminName = '관리자이름';

async function setupAdminAccount() {
  try {
    console.log('관리자 계정 생성을 시작합니다...');
    
    // 1. Supabase Auth에서 사용자 생성
    console.log('Supabase Auth에 관리자 사용자 생성 중...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });
    
    if (authError) {
      console.error('관리자 계정 생성 오류:', authError);
      return;
    }
    
    console.log('관리자 사용자가 성공적으로 생성되었습니다:', authData.user.id);
    
    // 2. PostgreSQL을 통해 사용자 프로필에 관리자 정보 추가
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const insertQuery = `
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES ($1, $2, $3, $4)
      `;
      
      await client.query(insertQuery, [
        authData.user.id,
        adminEmail,
        adminName,
        'admin'
      ]);
      
      await client.query('COMMIT');
      
      console.log('관리자 프로필이 성공적으로 생성되었습니다.');
      console.log(`관리자 계정 정보:
- 이메일: ${adminEmail}
- 이름: ${adminName}
- 역할: admin
- UUID: ${authData.user.id}`);
      
    } catch (pgError) {
      await client.query('ROLLBACK');
      console.error('관리자 프로필 생성 오류:', pgError);
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('관리자 계정 설정 중 오류 발생:', error);
  } finally {
    await pool.end();
  }
}

// 스크립트 실행
setupAdminAccount().catch(err => {
  console.error('스크립트 실행 중 오류 발생:', err);
  process.exit(1);
});