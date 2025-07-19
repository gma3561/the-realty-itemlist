import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const AdminContainer = styled.div`
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const AdminTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#3498db' : 'transparent'};
  color: ${props => props.active ? 'white' : '#555'};
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.active ? '#3498db' : '#f5f5f5'};
  }
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-bottom: 2px solid #eee;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background-color: ${props => props.danger ? '#e74c3c' : '#3498db'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: ${props => props.danger ? '#c0392b' : '#2980b9'};
  }
`;

const FormContainer = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const FormTitle = styled.h3`
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

function AdminPanel() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 새 사용자 생성 폼 상태
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'staff'
  });

  useEffect(() => {
    if (!isAdmin()) {
      setError('관리자 권한이 필요합니다');
      return;
    }
    
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error('사용자 목록을 불러오는 중 오류 발생:', err);
      setError('사용자 목록을 불러오는 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      setError('모든 필드를 입력해주세요');
      return;
    }
    
    try {
      // 1. Supabase Auth에서 사용자 생성
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      // 2. 사용자 프로필 생성
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: authData.user.id,
            email: newUser.email,
            full_name: newUser.fullName,
            role: newUser.role
          }]);
          
        if (profileError) throw profileError;
        
        // 성공적으로 생성 후 폼 초기화 및 사용자 목록 새로고침
        setNewUser({
          email: '',
          password: '',
          fullName: '',
          role: 'staff'
        });
        
        fetchUsers();
      }
    } catch (err) {
      console.error('사용자 생성 중 오류 발생:', err);
      setError(`사용자 생성 중 오류 발생: ${err.message}`);
    }
  };

  if (!isAdmin()) {
    return (
      <AdminContainer>
        <p>이 페이지에 접근할 권한이 없습니다. 관리자 계정으로 로그인해주세요.</p>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminTitle>관리자 패널</AdminTitle>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          사용자 관리
        </Tab>
        <Tab 
          active={activeTab === 'properties'} 
          onClick={() => setActiveTab('properties')}
        >
          매물 관리
        </Tab>
      </TabContainer>
      
      {activeTab === 'users' && (
        <>
          <FormContainer>
            <FormTitle>새 사용자 추가</FormTitle>
            <form onSubmit={handleCreateUser}>
              <FormGroup>
                <Label htmlFor="email">이메일</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="fullName">이름</Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={newUser.fullName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="role">역할</Label>
                <Select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="staff">직원</option>
                  <option value="admin">관리자</option>
                </Select>
              </FormGroup>
              
              {error && <p style={{ color: 'red' }}>{error}</p>}
              
              <SubmitButton type="submit">사용자 추가</SubmitButton>
            </form>
          </FormContainer>
          
          <h3>사용자 목록</h3>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <UserTable>
              <thead>
                <tr>
                  <Th>이름</Th>
                  <Th>이메일</Th>
                  <Th>역할</Th>
                  <Th>생성일</Th>
                  <Th>작업</Th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <Td>{user.full_name}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.role === 'admin' ? '관리자' : '직원'}</Td>
                    <Td>{new Date(user.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <ActionButton>수정</ActionButton>
                      <ActionButton danger>삭제</ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </UserTable>
          )}
        </>
      )}
      
      {activeTab === 'properties' && (
        <div>
          <h3>매물 관리</h3>
          <p>이 섹션에서는 모든 매물을 관리할 수 있습니다.</p>
          {/* 매물 관리 컴포넌트를 여기에 추가하세요 */}
        </div>
      )}
    </AdminContainer>
  );
}

export default AdminPanel;