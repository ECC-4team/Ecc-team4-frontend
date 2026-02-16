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
  
  // ✅ 핵심: 삭제된 사진 URL을 기억하는 '블랙리스트' (새로고침 시에도 유지되게 로컬스토리지 활용)
  const [deletedPhotos, setDeletedPhotos] = useState(() => {
    const saved = localStorage.getItem(`deleted_${placeId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isMemoEditing, setIsMemoEditing] = useState(false);

  const categories = [
    { label: '관광', color: '#EF4444' }, { label: '체험', color: '#F97316' },
    { label: '쇼핑', color: '#2DD4BF' }, { label: '음식', color: '#22C55E' },
    { label: '숙소', color: '#A855F7' }, { label: '카페/디저트', color: '#FACC15' }
  ];

  const FORBIDDEN_LIST = ['관광', '체험', '쇼핑', '음식', '숙소', '카페', '디저트', '.png'];

  useEffect(() => {
    if (placeId !== 'new') {
      const fetchDetail = async () => {
        try {
          const response = await axios.get(`/trips/${tripId}/places/${placeId}`);
          if (response.data) {
            const { name, category, description, imageUrls, createdAt } = response.data;
            
            // 진짜 사진만 필터링
            const cleanUrls = (imageUrls || []).filter(url => 
              url?.includes('cloudinary.com') && !FORBIDDEN_LIST.some(word => url.includes(word))
            );

            setPreviewImages(cleanUrls);
            setPlaceName(name || '');
            setSelectedCategory(category || '');
            setMemo(description || '');
            setPlaceDate(createdAt?.split('T')[0] || '');
          }
        } catch (error) { setIsEditing(true); }
      };
      fetchDetail();
    }
  }, [placeId, tripId]);

  // ✅ 삭제 리스트가 바뀔 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem(`deleted_${placeId}`, JSON.stringify(deletedPhotos));
  }, [deletedPhotos, placeId]);

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

    // ✅ 만약 서버에서 온 URL이면 '영구 삭제 리스트'에 추가
    if (typeof targetImage === 'string' && targetImage.startsWith('http')) {
      setDeletedPhotos(prev => [...new Set([...prev, targetImage])]);
    }

    // 새 파일(data:) 삭제 처리
    if (typeof targetImage === 'string' && targetImage.startsWith('data:')) {
      const dataIdx = previewImages.slice(0, index).filter(img => img.startsWith('data:')).length;
      setNewFiles(prev => prev.filter((_, i) => i !== dataIdx));
    }

    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!placeName) return alert('장소명을 입력해주세요!');
    const formData = new FormData();
    const jsonData = { name: placeName, description: memo || "", category: selectedCategory || "" };
    formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
    
    // 새로 추가한 파일만 전송 (기존 사진은 이미 서버에 있음)
    newFiles.forEach(file => formData.append('images', file));

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (placeId === 'new') await axios.post(`/trips/${tripId}/places`, formData, config);
      else await axios.patch(`/trips/${tripId}/places/${placeId}`, formData, config);
      
      alert('저장되었습니다!');
      setIsEditing(false);
      setNewFiles([]); // 전송 완료 후 비우기
      navigate(`/trips/${tripId}/places`); 
    } catch (error) { alert("저장 실패"); }
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
                <input type="date" value={placeDate} onChange={(e) => setPlaceDate(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '5px 10px' }} />
              </div>
            </EditInputArea>
          ) : (
            <><h2>{placeName}</h2><div className="date-display"><FiCalendar /><span>{placeDate}</span></div></>
          )}
        </TitleSection>

        <CategoryGroup>
          {categories.map((cat) => (
            <CategoryBtn key={cat.label} isSelected={selectedCategory === cat.label} activeColor={cat.color} onClick={() => isEditing && setSelectedCategory(cat.label)}>{cat.label}</CategoryBtn>
          ))}
        </CategoryGroup>

        <CardList>
          {previewImages
            // ✅ [강력 필터] 삭제 리스트(deletedPhotos)에 들어있는 URL은 절대 렌더링 안 함
            .filter(img => !deletedPhotos.includes(img))
            .map((img, idx) => (
              <PhotoCard key={idx}>
                <img src={img} alt="preview" />
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