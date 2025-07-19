import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import PropertyList from '../components/PropertyList';
import PropertyDetail from '../components/PropertyDetail';

const PageContainer = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #2c3e50;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

function MyPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMyProperties = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('created_by', user.id)
          .order('등록일', { ascending: false });
          
        if (error) throw error;
        
        setProperties(data || []);
      } catch (err) {
        console.error('내 매물 가져오기 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyProperties();
  }, [user]);

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <PageContainer>
      <PageTitle>내가 등록한 매물</PageTitle>
      
      {properties.length === 0 && !loading ? (
        <EmptyState>
          <p>등록한 매물이 없습니다. 매물을 등록해 보세요!</p>
        </EmptyState>
      ) : (
        <PropertyList
          properties={properties}
          loading={loading}
          onPropertyClick={handlePropertyClick}
        />
      )}
      
      {showModal && selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={closeModal}
          showContactInfo={true}  // 내 매물은 항상 연락처 정보 표시
        />
      )}
    </PageContainer>
  );
}

export default MyPropertiesPage;