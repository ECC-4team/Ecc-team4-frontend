/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

export default function Button({
  children,
  bg, 
  padding, 
  radius, 
  width,  
  disabled = false, 
  onClick,
  type = 'button',
  style,
}) {
  return (
    <StyledButton
      bg={bg}
      padding={padding}
      radius={radius}
      width={width}    
      disabled={disabled}
      onClick={onClick}
      type={type}
      style={style}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  background: ${({ bg = '#2563eb' }) => bg};
  color: white;
  padding: ${({ padding = '12px 20px' }) => padding};
  border-radius: ${({ radius = '10px' }) => radius};
  

  width: ${({ width = 'auto' }) => width}; 
  
  border: none;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;