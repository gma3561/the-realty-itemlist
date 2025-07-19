import React from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Login';

const LoginPageContainer = styled.div`
  margin: 2rem auto;
  max-width: 600px;
`;

function LoginPage() {
  const { isAuthenticated } = useAuth();
  
  // 이미 로그인되어 있으면 홈으로 리다이렉트
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <LoginPageContainer>
      <Login />
    </LoginPageContainer>
  );
}

export default LoginPage;