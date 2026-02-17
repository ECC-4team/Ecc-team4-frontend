import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus, FiChevronLeft, FiCalendar, FiX } from 'react-icons/fi';
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

  const [placeName, setPlaceName] = useState('');
  const [placeDate, setPlaceDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [previewImages, setPreviewImages] = useState([]); 
  const [newFiles, setNewFiles] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [isMemoEditing, setIsMemoEditing] = useState(false);

  const FORBIDDEN_LIST = [
    'tour', 'activity', 'shopping', 'food', 'hotel', 'cafe', 'dessert', 'png'
  ];

  const CATEGORY_IMAGE_MAP = {
    '관광': 'https://res.cloudinary.com/dxlycqpyp/image/upload/v1/default/tour.png',
    '체험': 'https://res.cloudinary.com/dxlycqpyp/image/upload/v1/default/activity.png',
    '쇼핑': 'https://res.cloudinary.com/dxlycqpyp/image/upload/v1/default/shopping.png',
    '음식': 'https://res.cloudinary.com/dxlycqpyp/image/upload/v1/default/food.png',
    '숙소': 'https://res.cloudinary.com/dxlycqpyp/image/upload/v1/default/hotel.png',
    '카페/디저트': 'https://res.cloudinary.com/dxlycqpyp/image/upload/v1771146720/KakaoTalk_20260215_125850088_05_gy3bvu.png'
  };

  const categories = [
    { label: '관광', color: '#EF4444' },
    { label: '체험', color: '#F97316' },
    { label: '쇼핑', color: '#2DD4BF' },
    { label: '음식', color: '#22C55E' },
    { label: '숙소', color: '#A855F7' },
    { label: '카페/디저트', color: '#FACC15' }
  ];

  useEffect(() => {
    if (placeId !== 'new') {
      const fetchDetail = async () => {
        try {
          const response = await axios.get(`/trips/${tripId}/places/${placeId}`);
          if (response.data) {
            const { name, category, description, imageUrls, createdAt } = response.data;
            
            const cleanUrls = (imageUrls || []).filter(url => {
              if (typeof url !== 'string' || url.trim() === '') return false;
              const isCloudinary = url.includes('cloudinary.com');
              const isDefaultDir = url.includes('/default/'); 
              const hasForbiddenWord = FORBIDDEN_LIST.some(word => url.toLowerCase().includes(word.toLowerCase()));
              
              return isCloudinary && !isDefaultDir && !hasForbiddenWord;
            });

            setPreviewImages(cleanUrls);
            setPlaceName(name || '');
            setSelectedCategory(category || '');
            setMemo(description || '');
            setPlaceDate(createdAt?.split('T')[0] || '');
            setIsEditing(false);
          }
        } catch (error) {
          console.error("데이터 로드 실패:", error);
        }
      };
      fetchDetail();
    } else {
      setIsEditing(true); 
      setPlaceDate(new Date().toISOString().split('T')[0]);
    }
  }, [placeId, tripId]);

  const urlToFile = async (url, customName) => {
    try {
      const encodedUrl = url.split('/').map(part => 
        part.startsWith('http') ? part : encodeURIComponent(part)
      ).join('/').replace(/http%3A/g, 'http:').replace(/https%3A/g, 'https:');

      const response = await fetch(encodedUrl, { 
        mode: 'cors', 
        cache: 'no-cache' 
      });
      
      if (!response.ok) throw new Error(`Fetch failed with status: ${response.status}`);
      
      const data = await response.blob();
      const filename = customName || url.split('/').pop() || 'image.png';
      return new File([data], filename, { type: data.type });
    } catch (error) {
      console.error("urlToFile 변환 에러:", url, error);
      return null;
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const targetImage = previewImages[index];
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    if (typeof targetImage === 'string' && targetImage.startsWith('data:')) {
      const base64Index = previewImages.slice(0, index).filter(img => typeof img === 'string' && img.startsWith('data:')).length;
      setNewFiles(prev => prev.filter((_, i) => i !== base64Index));
    }
  };

  const handleSave = async () => {
    if (!placeName) return alert('장소명을 입력해주세요!');
    const formData = new FormData();
    const jsonData = { 
      name: placeName, 
      description: memo || "", 
      category: selectedCategory || "" 
    };
    formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
    
    try {
      const realUserUrls = previewImages.filter(img => {
        if (typeof img !== 'string' || !img.startsWith('http')) return false;
        return img.includes('cloudinary.com') && !img.includes('/default/');
      });

      const convertedExistingFiles = await Promise.all(realUserUrls.map(url => urlToFile(url)));
      
      // ✅ 수정된 부분: 기존 파일들을 배열의 앞(0번 인덱스)에 배치하여 썸네일 유지
      let finalFiles = [
        ...convertedExistingFiles.filter(f => f !== null),
        ...newFiles
      ];

      if (finalFiles.length === 0 && selectedCategory) {
        const remoteDefaultUrl = CATEGORY_IMAGE_MAP[selectedCategory];
        let defaultImageFile = await urlToFile(remoteDefaultUrl, `default_${selectedCategory}.png`);
        
        if (!defaultImageFile) {
          const localUrl = `/src/assets/${selectedCategory}.png`;
          defaultImageFile = await urlToFile(localUrl, `default_${selectedCategory}.png`);
        }
        
        if (defaultImageFile) finalFiles.push(defaultImageFile);
      }

      finalFiles.forEach(file => formData.append('images', file));

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (placeId === 'new') {
        await axios.post(`/trips/${tripId}/places`, formData, config);
      } else {
        await axios.patch(`/trips/${tripId}/places/${placeId}`, formData, config);
      }

      alert('저장되었습니다!');
      setIsEditing(false);
      navigate(`/trips/${tripId}/places`); 
    } catch (error) {
      console.error("저장 에러:", error);
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
              <input className="name-input" value={placeName} onChange={(e) => setPlaceName(e.target.value)} placeholder="장소명" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <FiCalendar color="#6B7280" />
                <input type="date" value={placeDate} onChange={(e) => setPlaceDate(e.target.value)}
                  style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '5px 10px', color: '#6B7280' }} />
              </div>
            </EditInputArea>
          ) : (
            <>
              <h2>{placeName || '장소명'}</h2>
              <div className="date-display" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', marginTop: '5px' }}>
                <FiCalendar /><span>{placeDate}</span>
              </div>
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
          {previewImages?.map((img, idx) => (
            <PhotoCard key={idx}>
              <img src={img} alt="preview" />
              {isEditing && <DeleteImgBtn onClick={() => removeImage(idx)}><FiX /></DeleteImgBtn>}
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
                <p style={{ whiteSpace: 'pre-wrap', flex: 1, margin: 0 }}>{memo || '메모를 입력하세요.'}</p>
                {isEditing && <FiEdit2 className="edit-icon" />}
              </div>
            )}
          </MemoBox>
        </MemoSection>

        <ActionWrapper>
          <Button bg="#587CFF" padding="10px 40px" radius="50px" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? (placeId === 'new' ? '저장하기' : '수정 완료') : '수정하기'}
          </Button>
        </ActionWrapper>
      </MainCard>
    </Container>
  );
}

export default PlaceDetailPage;