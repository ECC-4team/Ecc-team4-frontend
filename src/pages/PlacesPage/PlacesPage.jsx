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

// 기본 카테고리 이미지 import
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

  // ✅ [최종 수정] Cloudinary 주소와 더미 주소를 완벽히 구분합니다.
  const getDisplayImage = (place) => {
    const urls = Array.isArray(place.imageUrls) ? place.imageUrls : [];
    
    // 1. 진짜 사진 찾기: 사용자님이 주신 'cloudinary' 주소를 최우선으로 찾습니다.
    const realPhoto = urls.find(url => 
      url && typeof url === 'string' &&
      url.includes('cloudinary.com') && // ✅ Cloudinary 주소인지 확인
      !url.includes('nzvsch') && 
      !url.includes('emptyimage')
    );

    // 2. 만약 cloudinary 주소가 없다면 다른 http 주소라도 찾습니다.
    const fallbackPhoto = !realPhoto ? urls.find(url => 
      url && typeof url === 'string' && url.startsWith('http') && !url.includes('nzvsch')
    ) : null;

    // 🏆 진짜 사진(Cloudinary) > 일반 사진 > 카테고리 기본 이미지 순서입니다.
    return realPhoto || fallbackPhoto || getCategoryImg(place.category);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tripRes = await getTripDetail(tripId);
        if (tripRes.data?.data) setTripTitle(tripRes.data.data.title);

        const res = await axios.get(`/trips/${tripId}/places`);
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
        {tripTitle && <div style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#333', color: 'white', borderRadius: '8px', display: 'inline-block', fontSize: '14px' }}>{tripTitle}</div>}
        <TabSection>
          <TabButton onClick={() => navigate(`/trips/${tripId}/timeline`)}>일정</TabButton>
          <TabButton isActive={true}>장소</TabButton>
        </TabSection>
        <PlaceGrid>
          {places.map((place) => (
            <PlaceCard key={place.placeId} onClick={() => navigate(`/trips/${tripId}/places/${place.placeId}`)}>
              <TrashIcon onClick={(e) => handleDelete(e, place.placeId)}><FiTrash2 size={18} /></TrashIcon>
              <ImagePlaceholder>
                {/* ✅ 개선된 필터링 로직 적용 */}
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
                  {place.category ? place.category : '✈'}
                </PlaceTag>
                <div className="name-text">{place.name}</div>
              </CardInfo>
            </PlaceCard>
          ))}
          <AddCard onClick={() => navigate(`/trips/${tripId}/places/new`)}><FiPlus size={40} /><span>장소 추가</span></AddCard>
        </PlaceGrid>
        <FooterArea><Button bg="#587CFF" color="white" radius="50px" padding="10px 40px" onClick={() => navigate('/trips')}>목록으로 돌아가기</Button></FooterArea>
      </MainCard>
    </Container>
  );
}

export default PlacesPage;