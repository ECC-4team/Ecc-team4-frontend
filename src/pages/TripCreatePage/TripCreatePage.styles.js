import styled from '@emotion/styled';

export const PageWrapper = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  justify-content: center; /* 중앙 정렬 */
`;

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  padding-top: 40px;
`;

export const Form = styled.div`
  width: 50%;
  max-width: 1000px;
  background-color: #ffffff;
  padding: 48px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const Row = styled.div`
  display: flex;
  align-items: ${({ alignTop }) => (alignTop ? 'flex-start' : 'center')};
  gap: 20px;
  width: 100%;
`;

export const Label = styled.label`
  width: 100px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  flex-shrink: 0;
`;

export const TabContainer = styled.div`
  flex: 1;

  button {
    height: 48px;
    font-size: 15px;
    border-radius: 10px;
    width: 100%;
  }
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 12px;

  input {
    flex: 1;
    height: 50px;
    padding: 0 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }

  .react-datepicker {
    position: absolute;
    top: 54px;
    left: 0;
    z-index: 100;
  }

  .input-row {
    display: flex;
    gap: 16px;
  }
`;

export const ImageUploadWrapper = styled.div`
  width: 100%;
  height: 220px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    color: #9ca3af;
    font-size: 14px;
  }

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

export const FloatingButtonWrapper = styled.div`
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 1000;

  button {
    padding: 16px 32px;
    font-size: 16px;
  }
`;
