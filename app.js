// Supabase 클라이언트 초기화
const supabaseUrl = 'https://qwxghpwasmvottahchky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGdocHdhc212b3R0YWhjaGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTI3NTksImV4cCI6MjA2ODQ4ODc1OX0.4a1Oc66k9mGmXLoHmrKyZiVeZISpyzgq1BERrb_-8n8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM 요소
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const regionFilter = document.getElementById('regionFilter');
const typeFilter = document.getElementById('typeFilter');
const transactionFilter = document.getElementById('transactionFilter');
const resultCount = document.getElementById('resultCount');
const resultsList = document.getElementById('resultsList');
const detailModal = document.getElementById('detailModal');
const propertyDetails = document.getElementById('propertyDetails');
const closeModal = document.querySelector('.close');

// 필터 옵션 로딩
async function loadFilterOptions() {
  try {
    // 지역 옵션 로드
    const { data: regions, error: regionError } = await supabase
      .from('properties')
      .select('지역')
      .not('지역', 'is', null);
    
    if (regionError) throw regionError;
    
    // 중복 제거 및 정렬
    const uniqueRegions = [...new Set(regions.map(item => item.지역))].filter(Boolean).sort();
    
    uniqueRegions.forEach(region => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      regionFilter.appendChild(option);
    });
    
    // 매물 종류 옵션 로드
    const { data: types, error: typeError } = await supabase
      .from('properties')
      .select('매물종류')
      .not('매물종류', 'is', null);
    
    if (typeError) throw typeError;
    
    const uniqueTypes = [...new Set(types.map(item => item.매물종류))].filter(Boolean).sort();
    
    uniqueTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      typeFilter.appendChild(option);
    });
    
    // 거래 유형 옵션 로드
    const { data: transactions, error: transactionError } = await supabase
      .from('properties')
      .select('거래유형')
      .not('거래유형', 'is', null);
    
    if (transactionError) throw transactionError;
    
    const uniqueTransactions = [...new Set(transactions.map(item => item.거래유형))].filter(Boolean).sort();
    
    uniqueTransactions.forEach(transaction => {
      const option = document.createElement('option');
      option.value = transaction;
      option.textContent = transaction;
      transactionFilter.appendChild(option);
    });
    
    console.log('필터 옵션 로드 완료');
  } catch (error) {
    console.error('필터 옵션 로드 오류:', error);
  }
}

// 검색 실행
async function performSearch() {
  const searchTerm = searchInput.value.trim();
  const regionValue = regionFilter.value;
  const typeValue = typeFilter.value;
  const transactionValue = transactionFilter.value;
  
  try {
    let query = supabase.from('properties').select('*');
    
    // 검색어가 있는 경우
    if (searchTerm) {
      query = query.or(
        `연락처1.ilike.%${searchTerm}%,` +
        `연락처2.ilike.%${searchTerm}%,` +
        `연락처3.ilike.%${searchTerm}%,` +
        `매물명.ilike.%${searchTerm}%,` +
        `지역.ilike.%${searchTerm}%,` +
        `소유자.ilike.%${searchTerm}%,` +
        `소재지.ilike.%${searchTerm}%`
      );
    }
    
    // 필터 적용
    if (regionValue) query = query.eq('지역', regionValue);
    if (typeValue) query = query.eq('매물종류', typeValue);
    if (transactionValue) query = query.eq('거래유형', transactionValue);
    
    // 결과 제한 (페이지네이션 구현 시 조정)
    const { data, error } = await query.limit(100);
    
    if (error) throw error;
    
    displayResults(data);
    console.log('검색 완료:', data.length, '건 검색됨');
  } catch (error) {
    console.error('검색 오류:', error);
    resultCount.textContent = '0';
    resultsList.innerHTML = '<div class="error-message">검색 중 오류가 발생했습니다.</div>';
  }
}

// 결과 표시
function displayResults(results) {
  resultsList.innerHTML = '';
  resultCount.textContent = results.length;
  
  if (results.length === 0) {
    resultsList.innerHTML = '<div class="no-results">검색 결과가 없습니다.</div>';
    return;
  }
  
  results.forEach(property => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    
    // 매물명이 없으면 지역 + 소재지로 대체
    const displayName = property.매물명 || `${property.지역} ${property.소재지 || ''}`;
    
    resultItem.innerHTML = `
      <div class="property-name">${displayName}</div>
      <div class="property-info">
        <span>${property.지역 || '-'}</span> | 
        <span>${property.거래유형 || '-'}</span> | 
        <span>${property.금액 || '-'}</span>
      </div>
    `;
    
    // 클릭 시 상세정보 표시
    resultItem.addEventListener('click', () => {
      showPropertyDetails(property);
    });
    
    resultsList.appendChild(resultItem);
  });
}

// 매물 상세정보 표시
function showPropertyDetails(property) {
  propertyDetails.innerHTML = `
    <h2>${property.매물명 || `${property.지역} ${property.소재지 || ''}`}</h2>
    
    <div class="detail-row">
      <span class="detail-label">등록일:</span>
      <span class="detail-value">${property.등록일 || '-'}</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">지역:</span>
      <span class="detail-value">${property.지역 || '-'}</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">소재지:</span>
      <span class="detail-value">${property.소재지 || '-'}</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">매물종류:</span>
      <span class="detail-value">${property.매물종류 || '-'}</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">거래유형:</span>
      <span class="detail-value">${property.거래유형 || '-'}</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">금액:</span>
      <span class="detail-value">${property.금액 || '-'}</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">동/호:</span>
      <span class="detail-value">${property.동 || '-'} / ${property.호 || '-'}</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">소유자:</span>
      <span class="detail-value">${property.소유자 || '-'}</span>
    </div>
    
    <div class="detail-row">
      <span class="detail-label">연락처1:</span>
      <span class="detail-value">${property.연락처1 || '-'} ${property.연락자1 ? `(${property.연락자1})` : ''}</span>
    </div>
    
    ${property.연락처2 ? `
    <div class="detail-row">
      <span class="detail-label">연락처2:</span>
      <span class="detail-value">${property.연락처2} ${property.연락자2 ? `(${property.연락자2})` : ''}</span>
    </div>
    ` : ''}
    
    ${property.연락처3 ? `
    <div class="detail-row">
      <span class="detail-label">연락처3:</span>
      <span class="detail-value">${property.연락처3} ${property.연락자3 ? `(${property.연락자3})` : ''}</span>
    </div>
    ` : ''}
    
    <div class="detail-row">
      <span class="detail-label">담당자:</span>
      <span class="detail-value">${property.담당자 || '-'}</span>
    </div>
    
    ${property.비고 ? `
    <div class="detail-row">
      <span class="detail-label">비고:</span>
      <span class="detail-value">${property.비고}</span>
    </div>
    ` : ''}
  `;
  
  detailModal.style.display = 'block';
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
  // 필터 옵션 로드
  loadFilterOptions();
  
  // 검색 버튼 클릭
  searchButton.addEventListener('click', performSearch);
  
  // 엔터 키 검색
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
  
  // 모달 닫기 버튼
  closeModal.addEventListener('click', () => {
    detailModal.style.display = 'none';
  });
  
  // 모달 외부 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      detailModal.style.display = 'none';
    }
  });
  
  // 필터 변경 시 자동 검색
  regionFilter.addEventListener('change', performSearch);
  typeFilter.addEventListener('change', performSearch);
  transactionFilter.addEventListener('change', performSearch);
});