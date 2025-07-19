import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import PropertyList from '../components/PropertyList';
import PropertyDetail from '../components/PropertyDetail';

function HomePage() {
  const { isAdmin, isAuthenticated, user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    region: '',
    propertyType: '',
    transactionType: ''
  });
  
  // Options for filters
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    propertyTypes: [],
    transactionTypes: []
  });

  // Fetch properties from Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      
      try {
        let query = supabase.from('properties');
        
        // 인증 상태에 따라 다른 테이블/뷰 접근
        if (!isAuthenticated()) {
          // 비인증 사용자는 public_properties 뷰만 접근 가능
          query = supabase.from('public_properties');
        }
        
        const { data, error } = await query
          .select('*')
          .order('등록일', { ascending: false })
          .limit(100);
          
        if (error) throw error;
        
        setProperties(data || []);
        setFilteredProperties(data || []);
        
        // Extract filter options
        if (data) {
          const regions = [...new Set(data.map(item => item.지역).filter(Boolean))];
          const propertyTypes = [...new Set(data.map(item => item.매물종류).filter(Boolean))];
          const transactionTypes = [...new Set(data.map(item => item.거래유형).filter(Boolean))];
          
          setFilterOptions({
            regions: regions.sort(),
            propertyTypes: propertyTypes.sort(),
            transactionTypes: transactionTypes.sort()
          });
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [isAuthenticated, isAdmin]);

  // Handle search and filtering
  useEffect(() => {
    if (properties.length === 0) return;
    
    let filtered = [...properties];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        (property.지역 && property.지역.toLowerCase().includes(query)) ||
        (property.매물명 && property.매물명.toLowerCase().includes(query)) ||
        (property.소재지 && property.소재지.toLowerCase().includes(query)) ||
        (isAuthenticated() && property.연락처1 && property.연락처1.includes(query)) ||
        (property.소유자 && property.소유자.toLowerCase().includes(query))
      );
    }
    
    // Apply filters
    if (filters.region) {
      filtered = filtered.filter(property => property.지역 === filters.region);
    }
    
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.매물종류 === filters.propertyType);
    }
    
    if (filters.transactionType) {
      filtered = filtered.filter(property => property.거래유형 === filters.transactionType);
    }
    
    setFilteredProperties(filtered);
  }, [searchQuery, filters, properties, isAuthenticated]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // 특정 매물에 대한 연락처 정보 볼 수 있는지 확인
  const canViewContactInfo = (property) => {
    if (isAdmin()) return true;
    if (!isAuthenticated() || !user) return false;
    
    // 자신이 등록한 매물인 경우
    return property.created_by === user.id;
  };

  return (
    <>
      <Header />
      
      <SearchBar onSearch={handleSearch} />
      
      <FilterBar
        filters={filters}
        options={filterOptions}
        onFilterChange={handleFilterChange}
      />
      
      <PropertyList
        properties={filteredProperties}
        loading={loading}
        onPropertyClick={handlePropertyClick}
      />
      
      {showModal && selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={closeModal}
          showContactInfo={canViewContactInfo(selectedProperty)}
        />
      )}
    </>
  );
}

export default HomePage;