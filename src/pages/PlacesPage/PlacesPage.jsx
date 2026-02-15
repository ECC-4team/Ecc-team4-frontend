import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';
import axios from '../../services/api'; 
import { getTripDetail } from '../../services/trip-main';

import defaultImg from '../../assets/emptyimage.png';
import * as S from './PlacesPage.styles';
import Button from '../../components/Button';

function PlacesPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [deleteModeId, setDeleteModeId] = useState(null);
  const [places, setPlaces] = useState([]); 
  const [tripTitle, setTripTitle] = useState('');

  useEffect(() => {
    const fetchTripInfo = async () => {
      if (location.state?.trip?.title) {
        setTripTitle(location.state.trip.title);
        return;
      }
      try {
        const res = await getTripDetail(tripId);
        if (res.data && res.data.title) setTripTitle(res.data.title);
      } catch (error) {
        console.error("여행 정보 로딩 실패");
      }
    };
    fetchTripInfo();
  }, [tripId]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`/trips/${tripId}/places`);
        setPlaces(Array.isArray(response.data) ? response.data : (response.data?.places || []));
      } catch (error) {
        setPlaces([]);
      }
    };
    fetchPlaces();
  }, [tripId]);

  const handleDelete = async (placeId) => {
    if (window.confirm('이 장소를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/trips/${tripId}/places/${placeId}`);
        setPlaces(prev => prev.filter(p => p.placeId !== placeId));
        setDeleteModeId(null);
      } catch (error) {
        alert('삭제 실패');
      }
    }
  };

  return (
    <S.Container onClick={() => setDeleteModeId(null)}>
      <S.MainCard onClick={(e) => e.stopPropagation()}>
        <S.SectionTitle>MY VISITS</S.SectionTitle>
        <S.TripTitleBanner>{tripTitle || '여행'}</S.TripTitleBanner>

        <S.TabSection>
          <S.TabButton onClick={() => navigate(`/trips/${tripId}/timeline`)}>일정</S.TabButton>
          <S.TabButton isActive={true}>장소</S.TabButton>
        </S.TabSection>

        <S.PlaceGrid>
          {places.map((place) => (
            <S.PlaceCard key={place.placeId} onClick={() => navigate(`/trips/${tripId}/places/${place.placeId}`)}>
              {}
              <S.TrashIcon 
                isDeleteMode={deleteModeId === place.placeId}
                onClick={(e) => {
                  e.stopPropagation();
                  if (deleteModeId === place.placeId) {
                    handleDelete(place.placeId);
                  } else {
                    setDeleteModeId(place.placeId);
                  }
                }}
              >
                {deleteModeId === place.placeId ? <FiX /> : <FiTrash2 />}
              </S.TrashIcon>

              <S.ImagePlaceholder>
                <img src={place.coverImageUrl || defaultImg} alt={place.name} />
              </S.ImagePlaceholder>

              <S.CardInfo>
                <S.PlaceTag bgColor={getCategoryColor(place.category)}>{place.category}</S.PlaceTag>
                <div className="name-text">{place.name}</div>
                <span className="date">{place.createdAt?.split('T')[0]}</span>
              </S.CardInfo>
            </S.PlaceCard>
          ))}
          
          <S.AddCard onClick={() => navigate(`/trips/${tripId}/places/new`)}>
            <FiPlus size={40} />
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>장소 추가</span>
          </S.AddCard>
        </S.PlaceGrid>

        <S.FooterArea>
          <Button bg="#587CFF" color="white" radius="50px" padding="12px 40px" onClick={() => navigate('/trips')}>
            목록으로 돌아가기
          </Button>
        </S.FooterArea>
      </S.MainCard>
    </S.Container>
  );
}

const getCategoryColor = (category) => {
  const colors = { '관광': '#EF4444', '체험': '#F97316', '쇼핑': '#2DD4BF', '음식': '#22C55E', '숙소': '#A855F7', '카페/디저트': '#FACC15' };
  return colors[category] || '#587CFF';
};

export default PlacesPage;