import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavContainer = styled.nav`
  background-color: #2c3e50;
  padding: 1rem 0;
  margin-bottom: 2rem;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #3498db;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ecf0f1;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;

  &:hover {
    color: #e74c3c;
  }
`;

function NavBar() {
  const { user, logout, isAdmin, isStaff, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">매물 검색 시스템</Logo>
        
        <NavLinks>
          <NavLink to="/">홈</NavLink>
          
          {isAuthenticated() && (
            <>
              <NavLink to="/my-properties">내 매물</NavLink>
              <NavLink to="/add-property">매물 등록</NavLink>
            </>
          )}
          
          {isAdmin() && (
            <NavLink to="/admin">관리자</NavLink>
          )}
          
          {isAuthenticated() ? (
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          ) : (
            <NavLink to="/login">로그인</NavLink>
          )}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
}

export default NavBar;