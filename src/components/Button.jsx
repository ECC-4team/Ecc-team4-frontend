/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

export default function Button({
  children,
  bg, // 배경색
  padding, // 패딩
  radius, // 모서리 둥글기
  disabled = false, // 비활성화
  onClick,
  type = 'button',
  style,
}) {
  return (
    <StyledButton
      bg={bg}
      padding={padding}
      radius={radius}
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