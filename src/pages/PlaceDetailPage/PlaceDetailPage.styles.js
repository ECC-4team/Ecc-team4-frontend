import styled from '@emotion/styled';

export const Container = styled.div`
  background-color: #f3f7ff; min-height: 100vh; padding: 40px 20px; box-sizing: border-box;
`;

export const Navbar = styled.nav`
  max-width: 1000px; margin: 0 auto 20px; display: flex; align-items: center;
`;

export const LogoWrapper = styled.div`
  display: flex; align-items: center; gap: 12px; cursor: pointer;
  .logo-circle {
    width: 60px; height: 60px; border-radius: 50%; background: white;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    img { width: 80%; }
  }
  span { font-size: 24px; font-weight: bold; color: #333; }
`;

export const MainCard = styled.div`
  max-width: 1000px; width: 100%; margin: 0 auto; background: white;
  border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; gap: 25px; box-sizing: border-box;
`;

export const BackContainer = styled.div`
  display: flex; align-items: center; gap: 6px; color: #9CA3AF; cursor: pointer; width: fit-content;
  &:hover { color: #587CFF; }
`;

export const TitleSection = styled.div`
  h2 { font-size: 32px; font-weight: bold; margin: 0; color: #333; }
  .date-text { color: #6B7280; font-size: 16px; margin-top: 5px; display: block; }
`;

export const EditInputArea = styled.div`
  display: flex; flex-direction: column; gap: 15px;
  .name-input { border: none; border-bottom: 2px solid #eee; font-size: 32px; font-weight: bold; outline: none; width: 100%; }
  .date-input-box { display: flex; align-items: center; gap: 10px; color: #6B7280; input { border: 1px solid #ddd; padding: 8px; border-radius: 6px; } }
`;

export const CategoryGroup = styled.div` display: flex; gap: 10px; flex-wrap: wrap; `;

export const CategoryBtn = styled.button`
  padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold;
  background-color: ${props => props.isSelected ? props.activeColor : '#F3F4F6'};
  color: ${props => props.isSelected ? 'white' : '#9CA3AF'};
  transition: all 0.2s ease;
`;

export const CardList = styled.div` display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; `;

export const PhotoCard = styled.div`
  min-width: 220px; height: 220px; border-radius: 12px; overflow: hidden; flex-shrink: 0;
  position: relative; /* 삭제 버튼을 위한 기준점 */
  img { width: 100%; height: 100%; object-fit: cover; }
`;

// ✅ 이미지 삭제 버튼 스타일
export const DeleteImgBtn = styled.button`
  position: absolute; top: 10px; right: 10px;
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(0, 0, 0, 0.5); color: white;
  border: none; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s;
  &:hover { background: #FF4B4B; }
  svg { font-size: 16px; }
`;

export const AddMoreBtn = styled.div`
  min-width: 220px; height: 220px; border: 2px dashed #eee; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 40px; color: #587CFF; cursor: pointer; flex-shrink: 0;
  &:hover { background: #f8faff; border-color: #587CFF; }
`;

export const MemoSection = styled.div` h3 { font-size: 18px; font-weight: bold; margin-bottom: 15px; } `;

export const MemoBox = styled.div`
  background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px;
  textarea { width: 100%; min-height: 100px; border: 1px solid #587CFF; border-radius: 8px; padding: 15px; outline: none; }
  .memo-content { display: flex; justify-content: space-between; p { margin: 0; color: #4B5563; white-space: pre-wrap; flex: 1; } svg { color: #587CFF; cursor: pointer; margin-left: 10px; } }
`;

export const ActionWrapper = styled.div` display: flex; justify-content: flex-end; margin-top: 20px; `;