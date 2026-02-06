import styled from '@emotion/styled';

export const PageWrapper = styled.div`
  max-width: 500px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const Label = styled.label`
  width: 80px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
