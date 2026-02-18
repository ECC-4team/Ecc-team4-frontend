import styled from '@emotion/styled';

export default function Input({
  value,
  onChange,
  placeholder,
  width,
  padding,
  radius,
  type = 'text',
}) {
  return (
    <StyledInput
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      width={width}
      padding={padding}
      radius={radius}
    />
  );
}

const StyledInput = styled.input`
  width: ${({ width = '100%' }) => width};
  padding: ${({ padding = '12px 14px' }) => padding};
  border-radius: ${({ radius = '10px' }) => radius};
  border: 1px solid #d1d5db;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;
