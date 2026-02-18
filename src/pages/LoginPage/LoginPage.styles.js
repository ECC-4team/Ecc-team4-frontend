import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f1f7ff; 
  padding: 20px;
  box-sizing: border-box;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  text-align: center;
  width: 100%; 

  .logo-area {
    margin-bottom: 10px; 
  }

  h1 {
    font-size: 32px;
    font-weight: 800;
    color: #111827;
    margin: 0; 
    line-height: 1.5;
  }

  p {
    font-size: 16px;
    color: #6b7280;
    margin: 0; 
    margin-top: 2px; 
  }
`;

export const Logo = styled.img`
  width: 60px;
  height: auto;
  object-fit: contain;
  display: block;
`;

export const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0px 4px 20px rgba(37, 99, 235, 0.18);
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out; 
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
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  .input-icon {
    position: absolute;
    left: 15px;      
    color: #9ca3af; 
    font-size: 18px;
    z-index: 1; 
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 45px; 
    border: 1px solid ${(props) => (props.isError ? '#ef4444' : '#e5e7eb')};
    border-radius: 12px;
    background-color: #f9fafb;
    outline: none;
    font-size: 15px;
    box-sizing: border-box;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: ${(props) => (props.isError ? '#ef4444' : '#2563eb')};
      background-color: white;
      box-shadow: 0 0 0 3px ${(props) => (props.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)')};
    }
  }
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 11px;
  margin-top: 4px;
  margin-left: 4px;
  min-height: 14px; 
  display: block;
`;