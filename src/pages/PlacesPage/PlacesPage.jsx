import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from '../../services/api'; 
import { getTripDetail } from '../../services/trip-main';

import { 
  Container, MainCard, SectionTitle, TabSection, TabButton, 
  PlaceGrid, PlaceCard, TrashIcon, ImagePlaceholder, CardInfo, 
  PlaceTag, AddCard, FooterArea
} from './PlacesPage.styles';

import Button from '../../components/Button';

// 기본 아이콘 이미지들
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
  const [tripTitle, setTripTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // 카테고리별 기본 이미지 반환 함수
  const getCategoryImg = (category) => {
    if (!category) return defaultImg;
    const cat = category.trim();
    if (cat === '관광') return tourImg;
    if (cat === '체험') return activityImg;
    if (cat === '쇼핑') return shoppingImg;
    if (cat === '음식') return foodImg;
    if (cat === '숙소') return hotelImg;
    if (cat === '카페/디저트') return cafeImg;
    return defaultImg;
  };

  // ✅ [수정 완료] coverImageUrl 반영 및 썸네일 결정 로직
  const getDisplayImage = (place) => {
    if (!place) return defaultImg;

    // 1. 확인된 서버 데이터 키(coverImageUrl)를 최우선으로 가져오고, 
    //    없을 경우를 대비해 객체 내 모든 URL을 탐색합니다.
    const rawImages = place.coverImageUrl || place.imageUrls || place.images || [];
    const urls = Array.isArray(rawImages) ? rawImages : [rawImages];
    
    // 만약 위에서 못 찾았다면 객체 안의 모든 문자열 중 http 주소를 다 긁어옵니다.
    const allUrls = urls.length > 0 ? urls : Object.values(place).filter(val => typeof val === 'string' && val.startsWith('http'));

    // 2. 삭제 리스트 확인 (String 변환으로 안전하게 비교)
    const savedDeleted = localStorage.getItem(`deleted_${String(place.placeId)}`);
    const deletedPhotos = savedDeleted ? JSON.parse(savedDeleted) : [];

    // 3. 진짜 사진 찾기
    const realPhoto = allUrls.find(url => {
      if (!url) return false;
      // 상세페이지에서 삭제(X)한 사진은 제외
      if (deletedPhotos.includes(url)) return false;
      // 사용자가 올린 진짜 사진(Cloudinary) 여부 확인
      return url.includes('cloudinary.com');
    });

    // 🏆 진짜 사진이 있으면 사진을, 없으면 카테고리 아이콘을 반환합니다.
    return realPhoto || getCategoryImg(place.category);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tripRes = await getTripDetail(tripId);
        if (tripRes.data?.data) setTripTitle(tripRes.data.data.title);

        const res = await axios.get(`/trips/${tripId}/places`);
        // res.data가 배열인지 확인 후 세팅
        const finalData = Array.isArray(res.data) ? res.data : (res.data.places || res.data.data || []);
        setPlaces(finalData);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  const handleDelete = async (e, placeId) => {
    e.stopPropagation();
    if (!window.confirm("장소를 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/trips/${tripId}/places/${placeId}`);
      localStorage.removeItem(`deleted_${String(placeId)}`);
      setPlaces(prev => prev.filter(p => p.placeId !== placeId));
    } catch (err) {
      alert("삭제 실패");
    }
  };

  if (loading) return <Container>로딩 중...</Container>;

  return (
    <Container>
      <MainCard>
        <SectionTitle>MY VISITS</SectionTitle>
        {tripTitle && (
          <div style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#333', color: 'white', borderRadius: '8px', display: 'inline-block', fontSize: '14px' }}>
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
                  src={getDisplayImage(place)} 
                  alt={place.name} 
                  onError={(e) => { e.target.src = getCategoryImg(place.category); }} 
                />
              </ImagePlaceholder>
              <CardInfo>
                <PlaceTag 
                  style={{ color: 'white' }}
                  bgColor={
                    place.category === '관광' ? '#EF4444' : place.category === '체험' ? '#F97316' : 
                    place.category === '쇼핑' ? '#2DD4BF' : place.category === '음식' ? '#22C55E' : 
                    place.category === '숙소' ? '#A855F7' : place.category === '카페/디저트' ? '#FACC15' : '#587CFF'
                  }
                >
                  {place.category || '✈'}
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