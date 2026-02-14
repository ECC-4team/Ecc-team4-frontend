import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus, FiChevronLeft, FiCalendar, FiX } from 'react-icons/fi'; // FiX 추가
import * as S from './PlaceDetailPage.styles';
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
    { label: '관광', color: '#EF4444' },
    { label: '체험', color: '#F97316' },
    { label: '쇼핑', color: '#2DD4BF' },
    { label: '음식', color: '#22C55E' },
    { label: '숙소', color: '#A855F7' },
    { label: '카페/디저트', color: '#FACC15' }
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

  // ✅ 이미지 삭제 함수
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!placeName) return alert('장소명을 입력해주세요!');
    const savedPlaces = JSON.parse(localStorage.getItem(`places_${tripId}`)) || [];
    const currentCat = categories.find(c => c.label === selectedCategory);
    
    const placeData = {
      id: placeId === 'new' ? Date.now().toString() : placeId,
      name: placeName,
      date: placeDate,
      category: selectedCategory,
      color: currentCat ? currentCat.color : '#587CFF',
      memo: memo,
      images: images,
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
    <S.Container>
      <S.Navbar>
        <S.LogoWrapper onClick={() => navigate('/')}>
          <div className="logo-circle"><img src={logoImg} alt="logo" /></div>
          <span>Project4</span>
        </S.LogoWrapper>
      </S.Navbar>

      <S.MainCard>
        <S.BackContainer onClick={() => navigate(`/trips/${tripId}/places`)}>
          <FiChevronLeft /> <span>장소 페이지로 돌아가기</span>
        </S.BackContainer>

        <S.TitleSection>
          {isEditing ? (
            <S.EditInputArea>
              <input className="name-input" value={placeName} onChange={(e) => setPlaceName(e.target.value)} placeholder="장소명을 입력하세요" />
              <div className="date-input-box">
                <FiCalendar />
                <input type="date" value={placeDate} onChange={(e) => setPlaceDate(e.target.value)} />
              </div>
            </S.EditInputArea>
          ) : (
            <>
              <h2>{placeName || '장소명'}</h2>
              <span className="date-text">{placeDate}</span>
            </>
          )}
        </S.TitleSection>

        <S.CategoryGroup>
          {categories.map((cat) => (
            <S.CategoryBtn 
              key={cat.label} 
              isSelected={selectedCategory === cat.label} 
              activeColor={cat.color}
              onClick={() => isEditing && setSelectedCategory(cat.label)}
            >{cat.label}</S.CategoryBtn>
          ))}
        </S.CategoryGroup>

        <S.CardList>
          {images.map((img, idx) => (
            <S.PhotoCard key={idx}>
              <img src={img} alt="upload" />
              {/* ✅ 편집 모드일 때만 삭제 버튼 노출 */}
              {isEditing && (
                <S.DeleteImgBtn onClick={() => removeImage(idx)}>
                  <FiX />
                </S.DeleteImgBtn>
              )}
            </S.PhotoCard>
          ))}
          {isEditing && (
            <S.AddMoreBtn onClick={() => fileInputRef.current.click()}>
              <FiPlus /><input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple />
            </S.AddMoreBtn>
          )}
        </S.CardList>

        <S.MemoSection>
          <h3>Memo</h3>
          <S.MemoBox>
            {isMemoEditing && isEditing ? (
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} onBlur={() => setIsMemoEditing(false)} autoFocus />
            ) : (
              <div className="memo-content">
                <p>{memo || '메모를 입력하세요.'}</p>
                {isEditing && <FiEdit2 onClick={() => setIsMemoEditing(true)} />}
              </div>
            )}
          </S.MemoBox>
        </S.MemoSection>

        <S.ActionWrapper>
          <Button bg="#587CFF" padding="10px 40px" radius="50px" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? '저장하기' : '수정하기'}
          </Button>
        </S.ActionWrapper>
      </S.MainCard>
    </S.Container>
  );
}

export default PlaceDetailPage;