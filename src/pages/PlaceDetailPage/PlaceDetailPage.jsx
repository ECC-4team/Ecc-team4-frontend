import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus, FiChevronLeft, FiCalendar, FiX } from 'react-icons/fi';
import tourImg from '../../assets/관광.png';
import activityImg from '../../assets/체험.png';
import shoppingImg from '../../assets/쇼핑.png';
import foodImg from '../../assets/음식.png';
import hotelImg from '../../assets/숙소.png';
import cafeImg from '../../assets/카페디저트.png';

import {
  Container,
  Navbar,
  LogoWrapper,
  MainCard,
  BackContainer,
  TitleSection,
  EditInputArea,
  CategoryGroup,
  CategoryBtn,
  CardList,
  PhotoCard,
  DeleteImgBtn,
  AddMoreBtn,
  MemoSection,
  MemoBox,
  ActionWrapper
} from './PlaceDetailPage.styles';

import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';

function PlaceDetailPage() {
  const { tripId, placeId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [placeName, setPlaceName] = useState('');
  const [placeDate, setPlaceDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [images, setImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isMemoEditing, setIsMemoEditing] = useState(false);

  const categories = [
    { label: '관광', color: '#EF4444', defaultImg: tourImg },
    { label: '체험', color: '#F97316', defaultImg: activityImg },
    { label: '쇼핑', color: '#2DD4BF', defaultImg: shoppingImg },
    { label: '음식', color: '#22C55E', defaultImg: foodImg },
    { label: '숙소', color: '#A855F7', defaultImg: hotelImg },
    { label: '카페/디저트', color: '#FACC15', defaultImg: cafeImg }
  ];

  useEffect(() => {
    if (placeId === 'new') {
      setIsEditing(true);
      setPlaceDate(new Date().toISOString().split('T')[0]);
    } else {
      const savedPlaces = JSON.parse(localStorage.getItem(`places_${tripId}`)) || [];
      const data = savedPlaces.find(p => p.id === placeId);
      if (data) {
        setPlaceName(data.name);
        setPlaceDate(data.date);
        setSelectedCategory(data.category);
        setMemo(data.memo);
        setImages(data.images || []);
      }
      setIsEditing(false);
    }
  }, [placeId, tripId]);

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!placeName) return alert('장소명을 입력해주세요!');
    const savedPlaces = JSON.parse(localStorage.getItem(`places_${tripId}`)) || [];
    const currentCat = categories.find(c => c.label === selectedCategory);
    
    let finalImages = images;
    if (images.length === 0 && currentCat) {
      finalImages = [currentCat.defaultImg];
    }

    const placeData = {
      id: placeId === 'new' ? Date.now().toString() : placeId,
      name: placeName,
      date: placeDate,
      category: selectedCategory,
      color: currentCat ? currentCat.color : '#587CFF',
      memo: memo,
      images: finalImages,
    };

    const updated = placeId === 'new' 
      ? [...savedPlaces, placeData] 
      : savedPlaces.map(p => p.id === placeId ? placeData : p);

    localStorage.setItem(`places_${tripId}`, JSON.stringify(updated));
    alert('저장되었습니다!');
    navigate(`/trips/${tripId}/places`);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  return (
    <Container>
      <Navbar>
        <LogoWrapper onClick={() => navigate('/')}>
          <img src={logoImg} alt="logo" />
        </LogoWrapper>
      </Navbar>

      <MainCard>
        <BackContainer onClick={() => navigate(`/trips/${tripId}/places`)}>
          <FiChevronLeft /> <span>장소 페이지로 돌아가기</span>
        </BackContainer>

        <TitleSection>
          {isEditing ? (
            <EditInputArea>
              <input 
                className="name-input" 
                value={placeName} 
                onChange={(e) => setPlaceName(e.target.value)} 
                placeholder="장소명을 입력하세요" 
              />
              <div className="date-input-box">
                <FiCalendar />
                <input type="date" value={placeDate} onChange={(e) => setPlaceDate(e.target.value)} />
              </div>
            </EditInputArea>
          ) : (
            <>
              <h2>{placeName || '장소명'}</h2>
              <span className="date-text">{placeDate}</span>
            </>
          )}
        </TitleSection>

        <CategoryGroup>
          {categories.map((cat) => (
            <CategoryBtn 
              key={cat.label} 
              isSelected={selectedCategory === cat.label} 
              activeColor={cat.color}
              onClick={() => isEditing && setSelectedCategory(cat.label)}
            >
              {cat.label}
            </CategoryBtn>
          ))}
        </CategoryGroup>

        <CardList>
          {images.map((img, idx) => (
            <PhotoCard key={idx}>
              <img src={img} alt="upload" />
              {isEditing && (
                <DeleteImgBtn onClick={() => removeImage(idx)}>
                  <FiX />
                </DeleteImgBtn>
              )}
            </PhotoCard>
          ))}
          {isEditing && (
            <AddMoreBtn onClick={() => fileInputRef.current.click()}>
              <FiPlus />
              <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple />
            </AddMoreBtn>
          )}
        </CardList>

        <MemoSection>
          <h3>Memo</h3>
          <MemoBox>
            {/* 메모 입력창이 짤리지 않도록 스타일 수정 필요 */}
            {isMemoEditing && isEditing ? (
              <textarea 
                value={memo} 
                onChange={(e) => setMemo(e.target.value)} 
                onBlur={() => setIsMemoEditing(false)} 
                placeholder="내용을 입력하세요..."
                autoFocus 
              />
            ) : (
              <div className="memo-content">
                <p>{memo || '메모를 입력하세요.'}</p>
                {isEditing && <FiEdit2 onClick={() => setIsMemoEditing(true)} style={{ cursor: 'pointer' }} />}
              </div>
            )}
          </MemoBox>
        </MemoSection>

        <ActionWrapper>
          <Button bg="#587CFF" padding="10px 40px" radius="50px" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? '저장하기' : '수정하기'}
          </Button>
        </ActionWrapper>
      </MainCard>
    </Container>
  );
}

export default PlaceDetailPage;