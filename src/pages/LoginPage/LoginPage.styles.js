import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const Logo = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: -60px;
  display: flex;
  align-items: center;
  justify-content: center;

  img { width: 100%; height: 100%; object-fit: contain;}
`;

export const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0px 4px 20px rgba(37, 99, 235, 0.18);
  width: 100%;
  max-width: 420px;
`;

export const TabWrapper = styled.div`
  display: flex;
  justify-content: center;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 50px;
  margin-bottom: 24px;
`;

export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
  }

  input {
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    outline: none;
    &:focus { border-color: #2563eb; }
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 15px;      
    color: #9ca3af; 
    font-size: 18px;
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 45px; 
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background-color: #f9fafb;
    outline: none;

    &:focus {
      border-color: #2563eb;
    }
  }
`;