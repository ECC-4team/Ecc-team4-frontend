import styled from '@emotion/styled';

export const Container = styled.div`
  background-color: #f3f7ff; 
  min-height: 100vh; 
  padding: 40px 20px; 
  box-sizing: border-box;
`;

export const MainCard = styled.div`
  max-width: 1000px; 
  width: 100%; 
  margin: 0 auto; 
  background: white; 
  border-radius: 24px; 
  padding: 40px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); 
  display: flex; 
  flex-direction: column; 
  gap: 25px; 
  box-sizing: border-box;
`;

export const BackContainer = styled.div`
  display: flex; 
  align-items: center; 
  gap: 6px; 
  color: #9CA3AF; 
  cursor: pointer; 
  width: fit-content; 
  &:hover { color: #587CFF; } 
  span { font-size: 14px; }
`;

export const TitleSection = styled.div`
  h2 { font-size: 32px; font-weight: bold; margin: 0; color: #333; }
  .date-display { 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    color: #6B7280; 
    font-size: 16px; 
    margin-top: 5px; 
  }
`;

export const EditInputArea = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 15px;
  .name-input { border: none; border-bottom: 2px solid #587CFF; font-size: 32px; font-weight: bold; outline: none; width: 100%; padding-bottom: 5px; }
`;

export const CategoryGroup = styled.div` display: flex; gap: 10px; flex-wrap: wrap; `;

export const CategoryBtn = styled.button`
  padding: 10px 20px; 
  border-radius: 8px; 
  border: none; 
  cursor: pointer; 
  font-weight: bold; 
  font-size: 14px;
  background-color: ${(props) => (props.isSelected ? props.activeColor : '#F3F4F4')};
  color: ${(props) => (props.isSelected ? 'white' : '#9CA3AF')};
  transition: all 0.2s ease; 
  &:hover { opacity: 0.9; }
`;

export const CardList = styled.div` 
  display: flex; 
  gap: 15px; 
  overflow-x: auto; 
  padding: 10px 5px; 
  &::-webkit-scrollbar { height: 8px; } 
  &::-webkit-scrollbar-thumb { background: #587CFF; border-radius: 10px; } 
`;

export const PhotoCard = styled.div` 
  min-width: 220px; 
  height: 220px; 
  border-radius: 16px; 
  overflow: hidden; 
  flex-shrink: 0; 
  position: relative; 
  img { width: 100%; height: 100%; object-fit: cover; } 
`;

export const DeleteImgBtn = styled.button` 
  position: absolute; 
  top: 10px; 
  right: 10px; 
  width: 28px; 
  height: 28px; 
  border-radius: 50%; 
  background: rgba(255, 75, 75, 0.9); 
  color: white; 
  border: none; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
`;

export const AddMoreBtn = styled.div` 
  min-width: 220px; 
  height: 220px; 
  border: 2px dashed #587CFF; 
  border-radius: 16px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 40px; 
  color: #587CFF; 
  cursor: pointer; 
  background: #f8faff; 
`;

export const MemoSection = styled.div` h3 { font-size: 18px; font-weight: bold; margin-bottom: 15px; } `;

export const MemoBox = styled.div`
  background: #f9fafb; 
  border: 1px solid #e5e7eb; 
  border-radius: 12px; 
  padding: 20px;
  box-sizing: border-box;
  min-height: 100px;

  textarea { 
    width: 100%; 
    min-height: 120px; 
    border: 1px solid #587cff; 
    border-radius: 8px; 
    padding: 15px;
    box-sizing: border-box; 
    outline: none;
    font-family: inherit;
    resize: none;
    font-size: 16px;
  }
  
  .memo-content-wrapper { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    gap: 10px;
    width: 100%;

    p { 
      margin: 0; 
      white-space: pre-wrap; 
      flex: 1; 
      color: #4B5563;
      line-height: 1.6;
    } 

    .edit-icon { 
      color: #9CA3AF; 
      flex-shrink: 0; 
      margin-top: 4px;
      cursor: pointer;
    }
  }
`;

export const ActionWrapper = styled.div` display: flex; justify-content: flex-end; margin-top: 20px; `;