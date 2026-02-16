import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from '../../services/api'; 
// 여행 상세 정보를 가져오기 위한 서비스 import (TripCreatePage에서 사용한 것과 동일)
import { getTripDetail } from '../../services/trip-main';

import { 
  Container, MainCard, SectionTitle, TabSection, TabButton, 
  PlaceGrid, PlaceCard, TrashIcon, ImagePlaceholder, CardInfo, 
  PlaceTag, AddCard, FooterArea, TripNameBadge
} from './PlacesPage.styles';

import Button from '../../components/Button';

// 이미지 import
import defaultImg from '../../assets/emptyimage.png';
import tourImg from '../../assets/관광.png';
import activityImg from '../../assets/체험.png';
import shoppingImg from '../../assets/쇼핑.png';
import foodImg from '../../assets/음식.png';
import hotelImg from '../../assets/숙소.png';
import cafeImg from '../../assets/카페디저트.png';

function PlacesPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [places, setPlaces] = useState([]);
  const [tripTitle, setTripTitle] = useState(''); // 여행 제목 상태 추가
  const [loading, setLoading] = useState(true);

  // 카테고리별 이미지 매칭 로직
  const getCategoryImg = (category) => {
    if (!category) return defaultImg;
    const cat = category.trim();
    switch (cat) {
      case '관광': return tourImg;
      case '체험': return activityImg;
      case '쇼핑': return shoppingImg;
      case '음식': return foodImg;
      case '숙소': return hotelImg;
      case '카페/디저트': return cafeImg;
      default: return defaultImg;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. 여행 상세 정보 가져오기 (여행 제목 추출용)
        const tripRes = await getTripDetail(tripId);
        if (tripRes.data && tripRes.data.data) {
          setTripTitle(tripRes.data.data.title); // TripCreatePage에서 저장한 'title' 적용
        }

        // 2. 장소 목록 가져오기
        const res = await axios.get(`/trips/${tripId}/places`);
        setPlaces(Array.isArray(res.data) ? res.data : (res.data.places || []));
        
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        if (err.response?.status === 403) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId, navigate]);

  const handleDelete = async (e, placeId) => {
    e.stopPropagation();
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/trips/${tripId}/places/${placeId}`);
      setPlaces(prev => prev.filter(p => p.placeId !== placeId));
    } catch (err) { alert("삭제 실패"); }
  };

  if (loading) return <Container>로딩 중...</Container>;

  return (
    <Container>
      <MainCard>
        <SectionTitle>MY VISITS</SectionTitle>
        
        {/* 여행 제목 표시 영역 (TripCreatePage에서 만든 title이 여기에 뜹니다) */}
        {tripTitle && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '8px 16px', 
            backgroundColor: '#333', 
            color: 'white', 
            borderRadius: '8px',
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {tripTitle}
          </div>
        )}

        <TabSection>
          <TabButton onClick={() => navigate(`/trips/${tripId}/timeline`)}>일정</TabButton>
          <TabButton isActive={true}>장소</TabButton>
        </TabSection>

        <PlaceGrid>
          {places.map((place) => (
            <PlaceCard key={place.placeId} onClick={() => navigate(`/trips/${tripId}/places/${place.placeId}`)}>
              <TrashIcon onClick={(e) => handleDelete(e, place.placeId)}>
                <FiTrash2 size={18} />
              </TrashIcon>
              
              <ImagePlaceholder>
                <img 
                  src={(place.coverImageUrl && place.coverImageUrl.length > 5) ? place.coverImageUrl : getCategoryImg(place.category)} 
                  alt={place.name} 
                  onError={(e) => { e.target.src = getCategoryImg(place.category); }}
                />
              </ImagePlaceholder>
              
              <CardInfo>
                <PlaceTag bgColor={
                  place.category === '관광' ? '#EF4444' : 
                  place.category === '음식' ? '#22C55E' : 
                  place.category === '카페/디저트' ? '#FACC15' : '#587CFF'
                }>
                  {place.category || '미지정'}
                </PlaceTag>
                <div className="name-text">{place.name}</div>
              </CardInfo>
            </PlaceCard>
          ))}
          
          <AddCard onClick={() => navigate(`/trips/${tripId}/places/new`)}>
            <FiPlus size={40} />
            <span>장소 추가</span>
          </AddCard>
        </PlaceGrid>

        <FooterArea>
          <Button bg="#587CFF" color="white" radius="50px" padding="10px 40px" onClick={() => navigate('/trips')}>
            목록으로 돌아가기
          </Button>
        </FooterArea>
      </MainCard>
    </Container>
  );
}

export default PlacesPage;