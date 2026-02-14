import styled from '@emotion/styled';

export const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
`;

export const PageTitle = styled.h1`
  text-align: left;
  max-width: 1100px;
  margin: 40px auto 16px;
  font-size: 32px;
  font-weight: 700;
  color: #111827;
`;

export const Grid = styled.div`
  display: grid;
  gap: 24px;

  grid-template-columns: repeat(3, minmax(320px, 1fr));

  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(320px, 1fr));
    max-width: 720px;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    max-width: 360px;
  }
`;

export const ClickWrapper = styled.div`
  border: 2px solid #cdd9f4;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.2);
  }
`;

export const CardInner = styled.div`
  position: relative;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;

  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
  background-position: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
  }
`;

export const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  z-index: 1;

  background: transparent;
`;

export const Country = styled.div`
  position: absolute;
  right: 16px;
  bottom: 36px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
`;

export const Period = styled.div`
  position: absolute;
  right: 16px;
  bottom: 14px;
  font-size: 12px;
  color: #111827;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
`;

export const FloatingAddButton = styled.button`
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  font-size: 32px;
  line-height: 0;
  border: none;
  cursor: pointer;
  box-shadow: none;
  &:hover {
    background-color: #1d4ed8;
  }
  &:active {
    transform: scale(0.95);
  }
`;

/* 셀렉트 영역 */
export const FilterBar = styled.div`
  display: flex;
  justify-content: flex-end;

  max-width: 1100px; /* Grid랑 동일 */
  margin: 0 auto 16px;
  padding-right: 8px; /* 살짝 안쪽으로 */
`;

export const BlueSelectWrapper = styled.div`
  select {
    height: 44px;
    min-height: 44px;

    background-color: #1d4ed8;
    color: #ffffff;

    border: none;
    border-radius: 8px;
    padding: 0 36px 0 12px;

    &:hover {
      background-color: #1d4ed8;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.4);
    }

    option {
      color: #111827;
      background-color: #ffffff;
    }
  }
`;

/* 페이지 */
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;

  .pagination {
    display: flex;
    list-style: none;
    gap: 12px;
    padding: 0;
  }

  .pagination li {
    cursor: pointer;
    padding: 4px 8px;
    border: none;
    background: none;
    color: #111827;
    font-weight: 500;
    min-width: 24px;
    text-align: center;
    transition: color 0.2s;
  }

  .pagination li.active {
    border: 1.5px solid #111827;
    border-radius: 6px;
    background-color: #111827;
    color: #ffffff;
    font-weight: 700;
  }

  .pagination li:hover:not(.active) {
    background-color: #d1d5db;
  }
`;

export const CardActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 3;
`;

export const ActionButton = styled.button`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

export const EditButton = styled(ActionButton)`
  background-color: #dbd9d9;
  color: white;

  &:hover {
    background-color: #000000;
  }
`;

export const DeleteButton = styled(ActionButton)`
  background-color: #dbd9d9;
  color: white;

  &:hover {
    background-color: #000000;
  }
`;
