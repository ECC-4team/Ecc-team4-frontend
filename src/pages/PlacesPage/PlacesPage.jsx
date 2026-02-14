import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';
import * as S from './PlacesPage.styles';
import Button from '../../components/Button';

function PlacesPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('place');
  const [deleteModeId, setDeleteModeId] = useState(null);
  const [places, setPlaces] = useState([]);

  // ✅ 핵심: 페이지 진입 시 로컬스토리지에서 데이터 로드
  useEffect(() => {
    const savedPlaces = JSON.parse(localStorage.getItem(`places_${tripId}`)) || [];
    setPlaces(savedPlaces);
  }, [tripId]);

  const toggleDeleteMode = (id, e) => {
    e.stopPropagation();
    setDeleteModeId(deleteModeId === id ? null : id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('이 장소를 삭제하시겠습니까?')) {
      const updated = places.filter(p => p.id !== id);
      setPlaces(updated);
      localStorage.setItem(`places_${tripId}`, JSON.stringify(updated));
      setDeleteModeId(null);
    }
  };

  return (
    <S.Container onClick={() => setDeleteModeId(null)}>
      <S.MainCard>
        <S.SectionTitle>MY VISITS</S.SectionTitle>
        <S.TripTitleBanner>홍콩 여행 with 화연 | 4박 5일</S.TripTitleBanner>

        <S.TabSection>
          <S.TabButton isActive={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')}>일정</S.TabButton>
          <S.TabButton isActive={activeTab === 'place'} onClick={() => setActiveTab('place')}>장소</S.TabButton>
        </S.TabSection>

        <S.PlaceGrid>
          {places.map((place) => (
            <S.PlaceCard key={place.id} onClick={() => navigate(`/trips/${tripId}/places/${place.id}`)}>
              <S.TrashIcon onClick={(e) => toggleDeleteMode(place.id, e)}><FiTrash2 /></S.TrashIcon>
              {deleteModeId === place.id && (
                <S.DeleteConfirmCircle onClick={(e) => handleDelete(place.id, e)}><FiX /></S.DeleteConfirmCircle>
              )}
              <S.ImagePlaceholder>
                {place.images && place.images.length > 0 ? (
                  <img src={place.images[0]} alt="thumb" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                ) : <div className="icon-box">🖼️</div>}
              </S.ImagePlaceholder>
              <S.CardInfo>
                <S.PlaceTag bgColor={place.color}>{place.name}</S.PlaceTag>
                <span className="date">{place.date}</span>
              </S.CardInfo>
            </S.PlaceCard>
          ))}
          <S.AddCard onClick={() => navigate(`/trips/${tripId}/places/new`)}><FiPlus /></S.AddCard>
        </S.PlaceGrid>

        <S.FooterArea>
          <Button bg="#587CFF" color="white" radius="50px" padding="12px 40px" onClick={() => navigate('/trips/new')}>
            새로운 여행으로 이동하기
          </Button>
        </S.FooterArea>
      </S.MainCard>
    </S.Container>
  );
}

export default PlacesPage;