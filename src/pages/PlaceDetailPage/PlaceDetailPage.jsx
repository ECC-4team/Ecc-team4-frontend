import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus, FiChevronLeft, FiX } from 'react-icons/fi';
import axios from '../../services/api'; 

import {
  Container, MainCard, BackContainer, TitleSection, EditInputArea,
  CategoryGroup, CategoryBtn, CardList, PhotoCard, DeleteImgBtn,
  AddMoreBtn, MemoSection, MemoBox, ActionWrapper
} from './PlaceDetailPage.styles';

import Button from '../../components/Button';

function PlaceDetailPage() {
  const { tripId, placeId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [previewImages, setPreviewImages] = useState([]); 
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

  const FORBIDDEN_KEYWORDS = ['20260215_125850088', 'f8282aa9-a1de-4790-bb63-4faff119ab68', 'food', 'cafe', '/default/'];

  const isRealPhoto = (url) => {
    if (!url || typeof url !== 'string') return false;
    return !FORBIDDEN_KEYWORDS.some(kw => url.toLowerCase().includes(kw.toLowerCase()));
  };

  useEffect(() => {
    if (placeId !== 'new') {
      const fetchDetail = async () => {
        try {
          const response = await axios.get(`/trips/${tripId}/places/${placeId}`);
          if (response.data) {
            const { name, category, description, imageUrls } = response.data;
            setPlaceName(name || '');
            setSelectedCategory(category || '');
            setMemo(description || '');
            
            const onlyRealPhotos = (imageUrls || [])
              .filter(url => isRealPhoto(url))
              .map(url => ({ url, file: null, isNew: false }));
            setPreviewImages(onlyRealPhotos);
          }
        } catch (error) { console.error("데이터 로드 실패"); }
      };
      fetchDetail();
    } else { setIsEditing(true); }
  }, [placeId, tripId]);

  const urlToFile = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      const randomId = Math.random().toString(36).substring(2, 11);
      return new File([data], `photo_${randomId}.png`, { type: data.type });
    } catch (error) { return null; }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, { url: reader.result, file: file, isNew: true }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => setPreviewImages(prev => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!placeName) return alert('장소명을 입력해주세요!');
    
    const formData = new FormData();
    try {
      if (previewImages.length > 0) {
        for (const imgObj of previewImages) {
          if (imgObj.isNew && imgObj.file) formData.append('images', imgObj.file);
          else {
            const file = await urlToFile(imgObj.url);
            if (file) formData.append('images', file);
          }
        }
      } else {
        formData.append('images', new Blob([], { type: 'application/octet-stream' }));
      }

      const jsonData = { 
        name: placeName,
        description: memo,
        category: selectedCategory
      };
      formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

      if (placeId === 'new') await axios.post(`/trips/${tripId}/places`, formData);
      else await axios.patch(`/trips/${tripId}/places/${placeId}`, formData);

      alert('저장되었습니다!');
      setIsEditing(false);
      navigate(`/trips/${tripId}/places`);
    } catch (error) { 
      alert("저장에 실패했습니다."); 
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
            </EditInputArea>
          ) : (
            <h2>{placeName || '장소명 없음'}</h2>
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
          {previewImages.map((imgObj, idx) => (
            <PhotoCard 
              key={idx} 
              draggable={isEditing}
              onDragStart={() => isEditing && setDraggedIndex(idx)}
              onDragOver={(e) => {
                e.preventDefault();
                if (!isEditing || draggedIndex === null || draggedIndex === idx) return;
                const newImages = [...previewImages];
                const draggedItem = newImages[draggedIndex];
                newImages.splice(draggedIndex, 1);
                newImages.splice(idx, 0, draggedItem);
                setDraggedIndex(idx);
                setPreviewImages(newImages);
              }}
              onDragEnd={() => setDraggedIndex(null)}
            >
              <img src={imgObj.url} alt="preview" />
              {isEditing && (
                <DeleteImgBtn onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>
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
          <MemoBox onClick={() => isEditing && setIsMemoEditing(true)}>
            {isMemoEditing && isEditing ? (
              <textarea 
                value={memo} 
                onChange={(e) => setMemo(e.target.value)} 
                onBlur={() => setIsMemoEditing(false)} 
                autoFocus 
              />
            ) : (
              <div className="memo-content-wrapper">
                <p style={{ whiteSpace: 'pre-wrap' }}>{memo || '메모를 입력하세요.'}</p>
                {isEditing && <FiEdit2 className="edit-icon" />}
              </div>
            )}
          </MemoBox>
        </MemoSection>

        <ActionWrapper>
          <Button 
            bg="#587CFF" 
            padding="10px 40px" 
            radius="50px" 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? '저장하기' : '수정하기'}
          </Button>
        </ActionWrapper>
      </MainCard>
    </Container>
  );
}

export default PlaceDetailPage;
