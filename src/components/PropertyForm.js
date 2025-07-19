import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const FormContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  grid-column: 1 / -1;
  width: fit-content;
  margin-top: 1rem;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  grid-column: 1 / -1;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  margin-top: 1rem;
  grid-column: 1 / -1;
`;

function PropertyForm() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    등록일: new Date().toISOString().split('T')[0],
    고객번호: '',
    매물번호: '',
    매물상태: '',
    매물종류: '',
    완료일자: '',
    담당자: '',
    지역: '',
    매물명: '',
    동: '',
    호: '',
    거래유형: '',
    금액: '',
    소재지: '',
    소유자: '',
    식별번호: '',
    비고: '',
    연락처1: '',
    연락자1: '',
    관계1: '',
    연락처2: '',
    연락자2: '',
    관계2: '',
    연락처3: '',
    연락자3: '',
    관계3: '',
    연락메모: ''
  });

  const propertyTypes = [
    '공동주택',
    '단독주택',
    '오피스텔',
    '아파트',
    '공동주택/주상복합',
    '공동주택/빌라',
    '공동주택/아파트',
    '업무시설',
    '기타'
  ];

  const transactionTypes = [
    '매매',
    '전세',
    '월세',
    '반전세',
    '렌트',
    '단기',
    '분양'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setError('로그인이 필요합니다');
      return;
    }
    
    // 필수 필드 검증
    if (!formData.지역 || !formData.매물종류 || !formData.거래유형) {
      setError('지역, 매물종류, 거래유형은 필수 입력 항목입니다');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Supabase에 매물 데이터 저장
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          ...formData,
          created_by: user.id
        }]);
        
      if (error) throw error;
      
      setSuccess('매물이 성공적으로 등록되었습니다');
      
      // 폼 초기화
      setFormData({
        등록일: new Date().toISOString().split('T')[0],
        고객번호: '',
        매물번호: '',
        매물상태: '',
        매물종류: '',
        완료일자: '',
        담당자: '',
        지역: '',
        매물명: '',
        동: '',
        호: '',
        거래유형: '',
        금액: '',
        소재지: '',
        소유자: '',
        식별번호: '',
        비고: '',
        연락처1: '',
        연락자1: '',
        관계1: '',
        연락처2: '',
        연락자2: '',
        관계2: '',
        연락처3: '',
        연락자3: '',
        관계3: '',
        연락메모: ''
      });
      
    } catch (err) {
      console.error('매물 등록 중 오류 발생:', err);
      setError(`매물 등록 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <FormContainer>
        <p>이 기능을 사용하려면 로그인이 필요합니다.</p>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>새 매물 등록</FormTitle>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="등록일">등록일</Label>
          <Input
            type="date"
            id="등록일"
            name="등록일"
            value={formData.등록일}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="지역">지역 *</Label>
          <Input
            type="text"
            id="지역"
            name="지역"
            value={formData.지역}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="매물종류">매물 종류 *</Label>
          <Select
            id="매물종류"
            name="매물종류"
            value={formData.매물종류}
            onChange={handleInputChange}
            required
          >
            <option value="">선택하세요</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="거래유형">거래 유형 *</Label>
          <Select
            id="거래유형"
            name="거래유형"
            value={formData.거래유형}
            onChange={handleInputChange}
            required
          >
            <option value="">선택하세요</option>
            {transactionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="매물명">매물명</Label>
          <Input
            type="text"
            id="매물명"
            name="매물명"
            value={formData.매물명}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="소재지">소재지</Label>
          <Input
            type="text"
            id="소재지"
            name="소재지"
            value={formData.소재지}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="동">동</Label>
          <Input
            type="text"
            id="동"
            name="동"
            value={formData.동}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="호">호</Label>
          <Input
            type="text"
            id="호"
            name="호"
            value={formData.호}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="금액">금액</Label>
          <Input
            type="text"
            id="금액"
            name="금액"
            value={formData.금액}
            onChange={handleInputChange}
            placeholder="예: 3억, 5000/50"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="담당자">담당자</Label>
          <Input
            type="text"
            id="담당자"
            name="담당자"
            value={formData.담당자}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="소유자">소유자</Label>
          <Input
            type="text"
            id="소유자"
            name="소유자"
            value={formData.소유자}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="식별번호">식별번호</Label>
          <Input
            type="text"
            id="식별번호"
            name="식별번호"
            value={formData.식별번호}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="연락처1">연락처 1</Label>
          <Input
            type="text"
            id="연락처1"
            name="연락처1"
            value={formData.연락처1}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="연락자1">연락자 1</Label>
          <Input
            type="text"
            id="연락자1"
            name="연락자1"
            value={formData.연락자1}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="관계1">관계 1</Label>
          <Input
            type="text"
            id="관계1"
            name="관계1"
            value={formData.관계1}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="연락처2">연락처 2</Label>
          <Input
            type="text"
            id="연락처2"
            name="연락처2"
            value={formData.연락처2}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="연락자2">연락자 2</Label>
          <Input
            type="text"
            id="연락자2"
            name="연락자2"
            value={formData.연락자2}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="관계2">관계 2</Label>
          <Input
            type="text"
            id="관계2"
            name="관계2"
            value={formData.관계2}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="연락메모">연락 메모</Label>
          <TextArea
            id="연락메모"
            name="연락메모"
            value={formData.연락메모}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="비고">비고</Label>
          <TextArea
            id="비고"
            name="비고"
            value={formData.비고}
            onChange={handleInputChange}
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? '등록 중...' : '매물 등록'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
}

export default PropertyForm;