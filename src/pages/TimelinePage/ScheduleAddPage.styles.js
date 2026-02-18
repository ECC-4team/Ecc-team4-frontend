import styled from '@emotion/styled';

export const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  box-sizing: border-box;
  min-height: 100vh;
`;

export const CardWrapper = styled.div`
  width: 800px;
  max-width: 95%;
`;

export const Row = styled.div`
  display: flex;
  align-items: ${({ alignTop }) => (alignTop ? 'flex-start' : 'center')};
  gap: 24px;
  width: 100%;
  margin-bottom: 24px;
`;

export const Label = styled.label`
  width: 120px;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const DatePickerWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;

  input {
    width: 100%;
    height: 50px;
    padding: 0 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
  }
`;

export const TimeRangeWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;

  input {
    width: 100%;
    height: 50px;
    padding: 0 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
  }

  .tilde {
    font-size: 18px;
    color: #6b7280;
    flex-shrink: 0;
  }
`;

export const TextAreaWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  textarea {
    width: 100%;
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    resize: none;
    box-sizing: border-box;
  }
`;
