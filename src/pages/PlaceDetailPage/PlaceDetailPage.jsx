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

// UI용 로컬 자산 (화면 상단 카테고리 버튼 등에서만 사용)
import tourImg from '../../assets/관광.png';
import activityImg from '../../assets/체험.png';
import shoppingImg from '../../assets/쇼핑.png';
import foodImg from '../../assets/음식.png';
import hotelImg from '../../assets/숙소.png';
import cafeImg from '../../assets/카페디저트.png';

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

  // ✅ [강력 제지] 기본 이미지로 의심되는 모든 키워드 차단 리스트
  const FORBIDDEN_LIST = [
    '관광', '체험', '쇼핑', '음식', '숙소', '카페', '디저트',
    'tour', 'activity', 'shopping', 'food', 'hotel', 'cafe', 'dessert',
    'category', 'default', 'basic', '.png' // 보통 진짜 사진은 .jpg나 .jpeg인 경우가 많으므로 .png를 의심군에 넣음
  ];

  useEffect(() => {
    if (placeId !== 'new') {
      const fetchDetail = async () => {
        try {
          const response = await axios.get(`/trips/${tripId}/places/${placeId}`);
          if (response.data) {
            const { name, category, description, imageUrls, createdAt } = response.data;
            
            // ✅ [강제 필터링] 
            // 1. Cloudinary 주소가 아니면 일단 차단
            // 2. FORBIDDEN_LIST에 포함된 단어가 URL에 하나라도 있으면 차단
            const cleanUrls = (imageUrls || []).filter(url => {
              if (typeof url !== 'string') return false;
              const isCloudinary = url.includes('cloudinary.com');
              const hasForbiddenWord = FORBIDDEN_LIST.some(word => url.toLowerCase().includes(word.toLowerCase()));
              
              // 클라우디너리 주소이면서 + 금지 단어가 하나도 없는 것만 "진짜 사진"으로 인정
              return isCloudinary && !hasForbiddenWord;
            });

            setPreviewImages(cleanUrls);
            setPlaceName(name || '');
            setSelectedCategory(category || '');
            setMemo(description || '');
            setPlaceDate(createdAt?.split('T')[0] || '');
            setIsEditing(false);
          }
        } catch (error) {
          setIsEditing(true);
        }
      };
      fetchDetail();
    } else {
      setIsEditing(true);
      setPlaceDate(new Date().toISOString().split('T')[0]);
    }
  }, [placeId, tripId]);

  const handleCategoryChange = (catLabel) => {
    if (!isEditing) return;
    setSelectedCategory(catLabel);
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
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!placeName) return alert('장소명을 입력해주세요!');
    
    const formData = new FormData();
    // 백엔드가 createdAt을 거부하므로 아예 제외
    const jsonData = { 
      name: placeName, 
      description: memo || "", 
      category: selectedCategory || "" 
    };
    
    formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
    
    // ✅ 저장할 때도 사용자가 새로 올린 '진짜 파일'들만 전송
    if (newFiles.length > 0) {
      newFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
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
      alert(`저장 실패: ${error.response?.data?.message || "입력 형식을 확인해주세요."}`);
    }
  };

  const categories = [
    { label: '관광', color: '#EF4444' },
    { label: '체험', color: '#F97316' },
    { label: '쇼핑', color: '#2DD4BF' },
    { label: '음식', color: '#22C55E' },
    { label: '숙소', color: '#A855F7' },
    { label: '카페/디저트', color: '#FACC15' }
  ];

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
            <CategoryBtn key={cat.label} isSelected={selectedCategory === cat.label} activeColor={cat.color} onClick={() => handleCategoryChange(cat.label)}>
              {cat.label}
            </CategoryBtn>
          ))}
        </CategoryGroup>

        <CardList>
          {/* ✅ [렌더링 단절] previewImages 중 base64(새 사진)이거나 금지단어가 없는 URL만 출력 */}
          {previewImages?.map((img, idx) => {
            // 새로 올린 사진(data:로 시작)은 통과
            if (typeof img === 'string' && img.startsWith('data:')) {
              return (
                <PhotoCard key={idx}>
                  <img src={img} alt="preview" />
                  {isEditing && <DeleteImgBtn onClick={() => removeImage(idx)}><FiX /></DeleteImgBtn>}
                </PhotoCard>
              );
            }
            
            // 기존 사진 중 금지 키워드가 있으면 렌더링하지 않음
            const isForbidden = FORBIDDEN_LIST.some(word => img?.toLowerCase().includes(word.toLowerCase()));
            if (isForbidden) return null;

            return (
              <PhotoCard key={idx}>
                <img src={img} alt="preview" />
                {isEditing && <DeleteImgBtn onClick={() => removeImage(idx)}><FiX /></DeleteImgBtn>}
              </PhotoCard>
            );
          })}
          
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
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} onBlur={() => setIsMemoEditing(false)} autoFocus />
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
            {isEditing ? '저장하기' : '수정하기'}
          </Button>
        </ActionWrapper>
      </MainCard>
    </Container>
  );
}

export default PlaceDetailPage;