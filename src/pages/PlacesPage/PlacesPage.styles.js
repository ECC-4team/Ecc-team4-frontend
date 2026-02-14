import styled from '@emotion/styled';

export const Container = styled.div`
  background-color: #f3f7ff;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
`;

export const MainCard = styled.div`
  max-width: 900px;
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #111;
`;

export const TripTitleBanner = styled.div`
  background-color: #333;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  width: fit-content;
  margin-bottom: 20px;
`;

export const TabSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;

export const TabButton = styled.button`
  padding: 8px 25px;
  font-size: 15px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  background-color: ${props => props.isActive ? '#587CFF' : '#E5E7EB'};
  color: ${props => props.isActive ? 'white' : '#6B7280'};
  transition: all 0.2s;
`;

export const PlaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
`;

export const PlaceCard = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  &:hover { transform: translateY(-5px); }
`;

export const TrashIcon = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  color: #9CA3AF;
  font-size: 18px;
  z-index: 5;
  &:hover { color: #FF4B4B; }
`;

export const DeleteConfirmCircle = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background-color: white;
  border: 1px solid #FF4B4B;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF4B4B;
  font-size: 20px;
  z-index: 10;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 75, 75, 0.3);
  &:hover {
    background-color: #FF4B4B;
    color: white;
  }
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 140px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
  .icon-box { font-size: 30px; opacity: 0.5; }
`;

export const CardInfo = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  .date { font-size: 13px; color: #aaa; }
`;

export const PlaceTag = styled.span`
  background-color: ${props => props.bgColor || '#587CFF'};
  color: white;
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
`;

export const AddCard = styled.div`
  height: 220px;
  border: 2px dashed #ddd;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #587CFF;
  cursor: pointer;
  &:hover { background: #f0f4ff; border-color: #587CFF; }
`;

export const FooterArea = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;