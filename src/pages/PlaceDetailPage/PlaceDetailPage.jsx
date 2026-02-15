import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus, FiChevronLeft, FiCalendar, FiX } from 'react-icons/fi';
import axios from '../../services/api'; 
import tourImg from '../../assets/관광.png';
import activityImg from '../../assets/체험.png';
import shoppingImg from '../../assets/쇼핑.png';
import foodImg from '../../assets/음식.png';
import hotelImg from '../../assets/숙소.png';
import cafeImg from '../../assets/카페디저트.png';

import {
  Container,
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

function PlaceDetailPage() {
  const { tripId, placeId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [placeName, setPlaceName] = useState('');
  const [placeDate, setPlaceDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [images, setImages] = useState([]); 
  const [newFiles, setNewFiles] = useState([]); 
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
    if (placeId !== 'new') {
      const fetchDetail = async () => {
        try {
          const response = await axios.get(`/trips/${tripId}/places/${placeId}`);
          if (response.data) {
            const { name, category, description, imageUrls, createdAt } = response.data;
            setPlaceName(name || '');
            setSelectedCategory(category || '');
            setMemo(description || '');
            setImages(imageUrls || []); 
            setPlaceDate(createdAt?.split('T')[0] || '');
            setIsEditing(false);
          }
        } catch (error) {
          console.error("장소 상세 정보 로딩 실패:", error);
          alert("상세 정보를 불러올 수 없어 편집 모드로 전환합니다.");
          setIsEditing(true);
        }
      };
      fetchDetail();
    } else {
      setIsEditing(true);
      setPlaceDate(new Date().toISOString().split('T')[0]);
    }
  }, [placeId, tripId]);

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!placeName) return alert('장소명을 입력해주세요!');

    const formData = new FormData();
    
    const jsonData = {
      name: placeName,
      description: memo || "",
      category: selectedCategory,
    };

    formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

    if (newFiles.length > 0) {
      newFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      if (placeId === 'new') {
        await axios.post(`/trips/${tripId}/places`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.patch(`/trips/${tripId}/places/${placeId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      alert('저장되었습니다!');
      navigate(`/trips/${tripId}/places`);
    } catch (error) {
      console.error("저장 실패 상세:", error.response?.data);
      const serverMsg = error.response?.data?.message || "서버 통신 오류가 발생했습니다.";
      alert(`저장에 실패했습니다: ${serverMsg}`);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewFiles(prev => [...prev, ...files]); 
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setImages(prev => [...prev, reader.result]); 
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <Container>
      <MainCard>
        <BackContainer onClick={() => navigate(`/trips/${tripId}/places`)}>
          <FiChevronLeft /> <span>MY VISITS로 돌아가기</span>
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
                <input 
                  type="date" 
                  value={placeDate} 
                  onChange={(e) => setPlaceDate(e.target.value)}
                  disabled={placeId !== 'new'} 
                />
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
                <p style={{ whiteSpace: 'pre-wrap' }}>{memo || '메모를 입력하세요.'}</p>
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