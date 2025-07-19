import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 확인
    const session = supabase.auth.getSession();
    setUser(session?.user || null);
    
    // 세션 변경 리스너
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 사용자 역할 가져오기
  async function fetchUserRole(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    }
  }

  // 로그인 함수
  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        await fetchUserRole(data.user.id);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 로그아웃 함수
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserRole(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 관리자 확인 함수
  function isAdmin() {
    return userRole === 'admin';
  }

  // 직원 확인 함수
  function isStaff() {
    return userRole === 'staff';
  }

  // 로그인 상태 확인
  function isAuthenticated() {
    return !!user;
  }

  const value = {
    user,
    userRole,
    loading,
    login,
    logout,
    isAdmin,
    isStaff,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}