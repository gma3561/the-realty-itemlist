import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import AddPropertyPage from './pages/AddPropertyPage';
import './App.css';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 20px;
`;

// 보호된 라우트를 위한 컴포넌트
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin, isStaff } = useAuth();
  
  if (!isAuthenticated()) {
    // 로그인이 필요한 경우
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole === 'admin' && !isAdmin()) {
    // 관리자 권한이 필요한 경우
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole === 'staff' && !isStaff() && !isAdmin()) {
    // 직원 권한이 필요한 경우
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <AppContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/my-properties" 
              element={
                <ProtectedRoute>
                  <MyPropertiesPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/add-property" 
              element={
                <ProtectedRoute requiredRole="staff">
                  <AddPropertyPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;