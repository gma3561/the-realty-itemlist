import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s;

  &:hover {
    color: #34495e;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #3498db;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const DetailRow = styled.div`
  margin-bottom: 0.75rem;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #7f8c8d;
  display: block;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  color: #333;
`;

const ContactSection = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
`;

function PropertyDetail({ property, onClose }) {
  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {property.매물명 || `${property.지역 || ''} ${property.소재지 || ''}`}
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <DetailSection>
            <SectionTitle>Property Information</SectionTitle>
            <DetailGrid>
              <DetailRow>
                <DetailLabel>Registration Date</DetailLabel>
                <DetailValue>{property.등록일 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Region</DetailLabel>
                <DetailValue>{property.지역 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Property Type</DetailLabel>
                <DetailValue>{property.매물종류 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Transaction Type</DetailLabel>
                <DetailValue>{property.거래유형 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Price</DetailLabel>
                <DetailValue>{property.금액 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Address</DetailLabel>
                <DetailValue>{property.소재지 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Building</DetailLabel>
                <DetailValue>{property.동 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Unit</DetailLabel>
                <DetailValue>{property.호 || '-'}</DetailValue>
              </DetailRow>
            </DetailGrid>
          </DetailSection>

          <DetailSection>
            <SectionTitle>Owner Information</SectionTitle>
            <DetailGrid>
              <DetailRow>
                <DetailLabel>Owner</DetailLabel>
                <DetailValue>{property.소유자 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>ID</DetailLabel>
                <DetailValue>{property.식별번호 || '-'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Manager</DetailLabel>
                <DetailValue>{property.담당자 || '-'}</DetailValue>
              </DetailRow>
            </DetailGrid>
          </DetailSection>

          <DetailSection>
            <SectionTitle>Contact Information</SectionTitle>
            <ContactSection>
              {property.연락처1 && (
                <DetailRow>
                  <DetailLabel>Primary Contact</DetailLabel>
                  <DetailValue>
                    {property.연락처1}
                    {property.연락자1 && ` (${property.연락자1})`}
                  </DetailValue>
                </DetailRow>
              )}
              
              {property.연락처2 && (
                <DetailRow>
                  <DetailLabel>Secondary Contact</DetailLabel>
                  <DetailValue>
                    {property.연락처2}
                    {property.연락자2 && ` (${property.연락자2})`}
                  </DetailValue>
                </DetailRow>
              )}
              
              {property.연락처3 && (
                <DetailRow>
                  <DetailLabel>Additional Contact</DetailLabel>
                  <DetailValue>
                    {property.연락처3}
                    {property.연락자3 && ` (${property.연락자3})`}
                  </DetailValue>
                </DetailRow>
              )}
              
              {property.연락메모 && (
                <DetailRow>
                  <DetailLabel>Contact Notes</DetailLabel>
                  <DetailValue>{property.연락메모}</DetailValue>
                </DetailRow>
              )}
            </ContactSection>
          </DetailSection>

          {property.비고 && (
            <DetailSection>
              <SectionTitle>Notes</SectionTitle>
              <DetailRow>
                <DetailValue>{property.비고}</DetailValue>
              </DetailRow>
            </DetailSection>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default PropertyDetail;