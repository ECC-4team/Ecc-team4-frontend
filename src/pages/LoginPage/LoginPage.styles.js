import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8faff;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const Logo = styled.div`
  width: 50px;
  height: 50px;
  background: #2563eb;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

export const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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