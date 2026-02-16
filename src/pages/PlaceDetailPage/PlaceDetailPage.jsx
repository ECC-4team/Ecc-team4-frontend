import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus, FiChevronLeft, FiCalendar, FiX } from 'react-icons/fi';
import axios from '../../services/api'; 

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
  const [existingImages, setExistingImages] = useState([]); // 서버 이미지
  const [newFiles, setNewFiles] = useState([]); // 새 업로드 파일
  const [previewImages, setPreviewImages] = useState([]); // 화면에 보여줄 이미지
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
    if (placeId !== 'new') {
      const fetchDetail = async () => {
        try {
          const response = await axios.get(`/trips/${tripId}/places/${placeId}`);
          if (response.data) {
            const { name, category, description, imageUrls, createdAt } = response.data;

            setPlaceName(name || '');
            setSelectedCategory(category || '');
            setMemo(description || '');
            setExistingImages(imageUrls || []);
            setPreviewImages(imageUrls || []); // 🔥 기본 이미지 안 넣고 서버 이미지 그대로만
            setPlaceDate(createdAt?.split('T')[0] || '');
            setIsEditing(false);
          }
        } catch (error) {
          console.error("장소 상세 정보 로딩 실패:", error);
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
    const updated = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updated);

    // 기존 이미지 제거
    setExistingImages(prev =>
      prev.filter((_, i) => i !== index)
    );

    // 새 파일 제거
    setNewFiles(prev =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setNewFiles(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSave = async () => {
    if (!placeName) return alert('장소명을 입력해주세요!');

    const formData = new FormData();

    const jsonData = {
      name: placeName,
      description: memo || "",
      category: selectedCategory,
      
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
    );

    newFiles.forEach(file => {
      formData.append('images', file);
    });

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
      console.error("저장 실패:", error.response?.data);
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
          {previewImages.map((img, idx) => (
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
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
              />
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
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {memo || '메모를 입력하세요.'}
                </p>
                {isEditing && (
                  <FiEdit2
                    onClick={() => setIsMemoEditing(true)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
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