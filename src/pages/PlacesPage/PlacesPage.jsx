import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';
import defaultImg from '../../assets/emptyimage.png';
import {
  Container,
  MainCard,
  SectionTitle,
  TripTitleBanner,
  TabSection,
  TabButton,
  PlaceGrid,
  PlaceCard,
  TrashIcon,
  DeleteConfirmCircle,
  ImagePlaceholder,
  CardInfo,
  PlaceTag,
  AddCard,
  FooterArea
} from './PlacesPage.styles';
import Button from '../../components/Button';

function PlacesPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('place');
  const [deleteModeId, setDeleteModeId] = useState(null);
  const [places, setPlaces] = useState([]);

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
    <Container onClick={() => setDeleteModeId(null)}>
      <MainCard>
        <SectionTitle>MY VISITS</SectionTitle>
        <TripTitleBanner>대전 여행 &nbsp;| &nbsp;3박 4일 </TripTitleBanner>

        <TabSection>
          <TabButton isActive={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')}>일정</TabButton>
          <TabButton isActive={activeTab === 'place'} onClick={() => setActiveTab('place')}>장소</TabButton>
        </TabSection>

        <PlaceGrid>
          {places.map((place) => (
            <PlaceCard key={place.id} onClick={() => navigate(`/trips/${tripId}/places/${place.id}`)}>
              <TrashIcon onClick={(e) => toggleDeleteMode(place.id, e)}>
                <FiTrash2 />
              </TrashIcon>
              
              {deleteModeId === place.id && (
                <DeleteConfirmCircle onClick={(e) => handleDelete(place.id, e)}>
                  <FiX />
                </DeleteConfirmCircle>
              )}

              <ImagePlaceholder>
                {place.images && place.images.length > 0 ? (
                  <img src={place.images[0]} alt="thumb" />
                ) : (
                  <img src={defaultImg} alt="default" />
                )}
              </ImagePlaceholder>

              <CardInfo>
                <PlaceTag bgColor={place.color}>{place.name}</PlaceTag>
                <span className="date">{place.date}</span>
              </CardInfo>
            </PlaceCard>
          ))}
          <AddCard onClick={() => navigate(`/trips/${tripId}/places/new`)}>
            <FiPlus />
          </AddCard>
        </PlaceGrid>

        <FooterArea>
          <Button bg="#587CFF" color="white" radius="50px" padding="12px 40px" onClick={() => navigate('/trips/new')}>
            새로운 여행으로 이동하기
          </Button>
        </FooterArea>
      </MainCard>
    </Container>
  );
}

export default PlacesPage;