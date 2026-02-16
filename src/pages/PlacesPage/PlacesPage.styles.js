import styled from '@emotion/styled';

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const MainCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

/* 여행 명칭 배지 스타일 추가/수정 */
export const TripNameBadge = styled.div`
  display: inline-block;
  background-color: #333333; /* 이미지 속 어두운 회색 적용 */
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 24px;
  cursor: default;

  &:hover {
    background-color: #333333; /* 호버 시에도 색상 유지 */
  }
`;

export const TabSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;

export const TabButton = styled.button`
  padding: 10px 25px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${props => (props.isActive ? '#587CFF' : '#E5E7EB')};
  color: ${props => (props.isActive ? 'white' : '#666')};
  font-weight: bold;
`;

export const PlaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

export const PlaceCard = styled.div`
  border: 1px solid #eee;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
  background: white;
  display: flex;
  flex-direction: column;
  height: 280px;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

export const TrashIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border: 1px solid #eee;
  &:hover {
    color: #ff4d4d;
    background: white;
  }
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 160px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    display: block;
  }
`;

export const CardInfo = styled.div`
  padding: 15px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .name-text {
    font-weight: bold;
    font-size: 18px;
    margin: 8px 0;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const PlaceTag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.bgColor === '#FACC15' ? '#333' : 'white'};
  background-color: ${props => props.bgColor || '#E5E7EB'};
  align-self: center;
`;

export const AddCard = styled.div`
  border: 2px dashed #ccc;
  border-radius: 15px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #587CFF;
  cursor: pointer;
  gap: 10px;
  background: #fff;
  &:hover {
    background: #f0f4ff;
    border-color: #587CFF;
  }
`;

export const FooterArea = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
`;